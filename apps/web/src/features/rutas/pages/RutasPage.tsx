'use client';

import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { useRutas } from '../hooks/useRutas';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { rutasColumns } from '@/shared/config/columns/rutas';
import type { Ruta } from '@/shared/api/types';

export const RutasPage = () => {
  const { rutas, isLoading, error } = useRutas();
  const { term, setTerm, filtered } = useFilteredData<Ruta>(rutas ?? [], ['name', 'code', 'routeCode']);
  return <PageLayout<Ruta> title="Rutas" data={filtered} columns={rutasColumns} searchTerm={term} onSearchChange={setTerm} isLoading={isLoading} error={error} />;
};
