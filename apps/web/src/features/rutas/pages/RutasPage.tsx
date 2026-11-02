'use client';

import { useState } from 'react';
import { FileUpload } from '@mui/icons-material';
import { PageLayout } from '@/shared/components/organisms/PageLayout';
import { useRutas } from '../hooks/useRutas';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { rutasColumns } from '@/shared/config/columns/rutas';
import { ImportKmzDialog } from '../components/ImportKmzDialog';
import { RutaDetailDialog } from '../components/RutaDetailDialog';
import type { Ruta } from '@/shared/api/types';

export const RutasPage = () => {
  const { rutas, isLoading, error } = useRutas();
  const { term, setTerm, filtered } = useFilteredData<Ruta>(rutas ?? [], ['name', 'code', 'routeCode']);
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState<Ruta | null>(null);
  return <>
    <PageLayout<Ruta> title="Rutas" data={filtered} columns={rutasColumns} searchTerm={term} onSearchChange={setTerm}
      action={{ label: 'Importar KMZ', icon: <FileUpload />, onClick: () => setImportOpen(true) }}
      onView={setSelected} isLoading={isLoading} error={error} />
    <ImportKmzDialog open={importOpen} onClose={() => setImportOpen(false)} />
    <RutaDetailDialog ruta={selected} onClose={() => setSelected(null)} />
  </>;
};
