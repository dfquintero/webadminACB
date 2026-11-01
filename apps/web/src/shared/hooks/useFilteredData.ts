import { useState } from 'react';

export const useFilteredData = <T,>(data: T[], searchFields: (keyof T)[] = []) => {
  const [term, setTerm] = useState('');
  const query = term.trim().toLocaleLowerCase('es');
  const filtered = !query || searchFields.length === 0 ? data : data.filter(item =>
    searchFields.some(field => String(item[field] ?? '').toLocaleLowerCase('es').includes(query)),
  );
  return { term, setTerm, filtered };
};
