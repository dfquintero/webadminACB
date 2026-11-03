import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';

const SCHOOL_BRANCH = 'RUTAS AL COLEGIO EN BICI';
const ROUTE_CODES = new Set(['541', '542']);
const MEETING_FOLDERS = ['PUNTOS DE ENCUENTRO', 'PUNTOS DE ENCUENTO'];
const SCHOOL_MARKERS = ['COLEGIO', 'LICEO', 'SEDE', 'INSTITUCION EDUCATIVA', 'CENTRO EDUCATIVO'];

export const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();

export type PreviewRoute = { name: string; code: string; routeCode: string | null };
export type KmzPreview = { routes: PreviewRoute[]; meetingPoints: number; schools: number };
type ParsedKmz = { entries: Record<string, Uint8Array>; docs: { name: string; doc: Document }[] };
type Visitor = { route?: (placemark: Element, route: PreviewRoute) => void; point?: (kind: 'meeting' | 'school') => void };

export const routeKey = (route: { name: string; code?: string | null; routeCode?: string | null }) =>
  `${route.routeCode ?? ''}|${route.code ?? ''}|${normalize(route.name)}`;

const childText = (element: Element, tag: string) =>
  Array.from(element.children).find(child => child.localName === tag)?.textContent?.trim() ?? '';

const coordinateCount = (element: Element) =>
  (element.getElementsByTagNameNS('*', 'coordinates')[0]?.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;

const groupCode = (path: string[]) => {
  const index = path.indexOf(SCHOOL_BRANCH);
  return index >= 0 ? path[index + 1]?.match(/^([A-Z]{2}\d{2})\b/)?.[1] ?? null : null;
};

const displayName = (name: string, raw: string[]) => {
  if (!/^\d+$/.test(name.trim())) return name;
  const group = raw.map(segment => segment.match(/^\s*([A-Z]{2}\d{2})\s*[-–—]\s*(.+?)\s*$/i)).find(Boolean);
  return group ? `${name.trim()} - ${group[2]}` : name;
};

const visit = (element: Element, raw: string[], visitor: Visitor) => {
  for (const child of Array.from(element.children)) {
    if (child.localName === 'Folder') visit(child, [...raw, childText(child, 'name')], visitor);
    else if (child.localName === 'Document') visit(child, raw, visitor);
    else if (child.localName === 'Placemark') {
      const path = raw.map(normalize);
      if (!path.includes(SCHOOL_BRANCH)) continue;
      const name = childText(child, 'name') || 'Unnamed';
      const normalized = normalize(name);
      const code = name.match(/^\s*(\d{3})\b/)?.[1];
      const isRoute = !!code && ROUTE_CODES.has(code) && path.some(s => s === 'RUTA' || s === 'RUTAS')
        && Array.from(child.getElementsByTagNameNS('*', 'LineString')).some(line => coordinateCount(line) >= 2);
      if (isRoute) visitor.route?.(child, { name: displayName(name, raw), code: code!, routeCode: groupCode(path) });
      if (child.getElementsByTagNameNS('*', 'Point').length) {
        if (/^PE\s*\d+$/.test(normalized) || path.some(s => MEETING_FOLDERS.some(f => s.startsWith(f)))) visitor.point?.('meeting');
        else if (normalized.split(' ').includes('IED') || SCHOOL_MARKERS.some(m => normalized.includes(m))) visitor.point?.('school');
      }
    }
  }
};

export const parseKmz = async (file: File): Promise<ParsedKmz> => {
  const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const names = Object.keys(entries).filter(name => name.toLowerCase().endsWith('.kml') && !name.startsWith('__MACOSX/'));
  if (!names.length) throw new Error('El KMZ no contiene archivos KML.');
  const docs = names.map(name => ({ name, doc: new DOMParser().parseFromString(strFromU8(entries[name]), 'application/xml') }));
  if (docs.some(({ doc }) => doc.getElementsByTagName('parsererror').length)) throw new Error('El KML no es válido.');
  return { entries, docs };
};

export const previewKmz = ({ docs }: ParsedKmz): KmzPreview => {
  const preview: KmzPreview = { routes: [], meetingPoints: 0, schools: 0 };
  for (const { doc } of docs) visit(doc.documentElement, [], {
    route: (_, route) => preview.routes.push(route),
    point: kind => { if (kind === 'meeting') preview.meetingPoints += 1; else preview.schools += 1; },
  });
  return preview;
};

export const withoutRoutes = ({ entries, docs }: ParsedKmz, existing: Set<string>): Uint8Array => {
  const output = { ...entries };
  for (const { name, doc } of docs) {
    const copy = doc.cloneNode(true) as Document;
    const remove: Element[] = [];
    visit(copy.documentElement, [], { route: (placemark, route) => { if (existing.has(routeKey(route))) remove.push(placemark); } });
    remove.forEach(placemark => placemark.remove());
    output[name] = strToU8(new XMLSerializer().serializeToString(copy));
  }
  return zipSync(output);
};
