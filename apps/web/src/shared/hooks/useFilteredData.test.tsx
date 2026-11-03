import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFilteredData } from './useFilteredData';

const data = [{ nombre: 'Ana' }, { nombre: 'Luis' }];

describe('useFilteredData', () => {
  it('keeps data visible when there are no search fields', () => {
    const { result } = renderHook(() => useFilteredData(data));
    expect(result.current.filtered).toEqual(data);
  });

  it('matches without case sensitivity and ignores surrounding whitespace', () => {
    const { result } = renderHook(() => useFilteredData(data, ['nombre']));
    act(() => result.current.setTerm('  ANA '));
    expect(result.current.filtered).toEqual([data[0]]);
  });
});
