import { useState, useMemo } from 'react';

export const useFilteredData = (data, searchFields = []) => {
  const [term, setTerm] = useState('');
  const filtered = useMemo(() => data.filter(item => 
    searchFields.some(field => String(item[field]).toLowerCase().includes(term.toLowerCase()))
  ), [data, term, searchFields]);
  return { term, setTerm, filtered };
};
