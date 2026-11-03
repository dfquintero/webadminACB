'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { latLngBounds, type LatLngTuple } from 'leaflet';
import type { GeoMeetingPoint, GeoRoute } from '@acb/contracts';

const palette = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa', '#00acc1', '#6d4c41', '#d81b60'];
const toLatLng = ([lon, lat]: [number, number]): LatLngTuple => [lat, lon];

const FitBounds = ({ points }: { points: LatLngTuple[] }) => {
  const map = useMap();
  useEffect(() => { if (points.length) map.fitBounds(latLngBounds(points), { padding: [24, 24] }); }, [map, points]);
  return null;
};

type Props = { routes: GeoRoute[]; points: GeoMeetingPoint[]; height?: string; numbered?: boolean };

export const RoutesMap = ({ routes, points, height = '70vh', numbered = false }: Props) => {
  const bounds = routes.flatMap(route => route.geometry?.coordinates.map(toLatLng) ?? []);
  const labels = new Map(points.filter(point => point.kind !== 'school').map((point, index) => [point._id, String(index + 1)]));
  return <MapContainer center={[4.65, -74.1]} zoom={12} style={{ height, width: '100%', borderRadius: 8 }}>
    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <FitBounds points={bounds} />
    {routes.map((route, index) => route.geometry &&
      <Polyline key={route._id} positions={route.geometry.coordinates.map(toLatLng)} pathOptions={{ color: palette[index % palette.length], weight: 4 }}>
        <Popup><b>{route.name}</b><br />Código {route.code ?? '—'} · {route.route_code ?? '—'}</Popup>
      </Polyline>)}
    {points.map(point => {
      const school = point.kind === 'school';
      const label = numbered ? labels.get(point._id) : undefined;
      return <CircleMarker key={point._id} center={toLatLng(point.location.coordinates)} radius={school ? 9 : numbered ? 7 : 5}
        pathOptions={{ color: school ? '#b71c1c' : '#0d47a1', fillOpacity: 0.85 }}>
        {label && <Tooltip permanent direction="top" offset={[0, -6]}>{label}</Tooltip>}
        <Popup><b>{point.name}</b><br />{school ? 'Colegio' : 'Punto de encuentro'}{point.description ? <><br />{point.description}</> : null}</Popup>
      </CircleMarker>;
    })}
  </MapContainer>;
};
