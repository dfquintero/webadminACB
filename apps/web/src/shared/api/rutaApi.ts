import { z } from 'zod';
import { geoImportResultSchema, geoMeetingPointSchema, geoRouteEndpointsSchema, geoRouteSchema } from '@acb/contracts';
import { apiClient } from './client';
import { endpoints } from './endpoints';
import { rutaResponse, type Ruta } from './types';

const haversineKm = (coords: [number, number][]): number | undefined => {
  if (coords.length < 2) return undefined;
  const rad = Math.PI / 180;
  let km = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];
    const h = Math.sin((lat2 - lat1) * rad / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin((lon2 - lon1) * rad / 2) ** 2;
    km += 6371 * 2 * Math.asin(Math.sqrt(h));
  }
  return Math.round(km * 100) / 100;
};

export const rutaApi = {
  getAll: async (signal?: AbortSignal): Promise<Ruta[]> => {
    const { data } = await apiClient.get<unknown>(endpoints.rutas, { signal });
    return z.array(geoRouteSchema).parse(data).map(route => rutaResponse.parse({
      id: route._id,
      name: route.name,
      code: route.code ?? null,
      routeCode: route.route_code ?? null,
      dayShift: route.day_shift ?? null,
      endpointStatus: route.endpoint_status ?? 'unknown',
      meetingPoints: route.meeting_point_ids?.length ?? 0,
      meetingPointIds: route.meeting_point_ids ?? [],
      distanceKm: route.geometry ? haversineKm(route.geometry.coordinates) : undefined,
    }));
  },
  getGeoRoutes: async (signal?: AbortSignal) => {
    const { data } = await apiClient.get<unknown>(endpoints.rutas, { signal });
    return z.array(geoRouteSchema).parse(data);
  },
  getEndpoints: async (id: string, signal?: AbortSignal) => {
    const { data } = await apiClient.get<unknown>(`${endpoints.rutas}/${encodeURIComponent(id)}/endpoints`, { signal });
    return geoRouteEndpointsSchema.parse(data);
  },
  getMeetingPoints: async (signal?: AbortSignal) => {
    const { data } = await apiClient.get<unknown>(endpoints.meetingPoints, { signal });
    return z.array(geoMeetingPointSchema).parse(data);
  },
  importKmz: async (file: File) => {
    const form = new FormData();
    form.append('file', file, file.name);
    const { data } = await apiClient.post<unknown>('/geo/imports/kmz', form);
    return geoImportResultSchema.parse(data);
  },
};
