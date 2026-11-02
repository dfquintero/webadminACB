import { describe, expect, it, vi } from 'vitest';
import { apiClient } from './client';
import { rutaApi } from './rutaApi';

vi.mock('./client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

const route = {
  _id: 'route-1', name: 'Ruta Norte', code: 'R1', route_code: 'RC-1', day_shift: 'AM', endpoint_status: 'resolved',
  meeting_point_ids: ['mp-1', 'mp-2'],
  geometry: { type: 'LineString', coordinates: [[-76.532, 3.451], [-76.545, 3.462]] },
};

describe('rutaApi', () => {
  it('maps geo routes to Ruta with computed distance', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [route] });
    const [ruta] = await rutaApi.getAll();
    expect(apiClient.get).toHaveBeenCalledWith('/geo/routes', { signal: undefined });
    expect(ruta).toMatchObject({ id: 'route-1', code: 'R1', routeCode: 'RC-1', meetingPoints: 2, meetingPointIds: ['mp-1', 'mp-2'] });
    expect(ruta?.distanceKm).toBeGreaterThan(0);
  });

  it('leaves distanceKm undefined with fewer than two coordinates', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [{ _id: 'r2', name: 'Ruta corta', geometry: { type: 'LineString', coordinates: [[-76.5, 3.45]] } }] });
    const [ruta] = await rutaApi.getAll();
    expect(ruta?.distanceKm).toBeUndefined();
    expect(ruta?.meetingPoints).toBe(0);
  });

  it('posts the KMZ file as FormData and returns the parsed result', async () => {
    const result = { saved_routes: 2, saved_points: 5, endpoints: { resolved: 1, unresolved: 0, not_applicable: 1 } };
    vi.mocked(apiClient.post).mockResolvedValue({ data: result });
    const file = new File(['synthetic'], 'rutas.kmz', { type: 'application/vnd.google-earth.kmz' });
    expect(await rutaApi.importKmz(file)).toMatchObject(result);
    const [path, body] = vi.mocked(apiClient.post).mock.calls[0] ?? [];
    expect(path).toBe('/geo/imports/kmz');
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('file')).toBeInstanceOf(File);
  });
});
