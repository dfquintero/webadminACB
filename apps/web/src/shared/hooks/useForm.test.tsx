import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useForm } from './useForm';

const schema = z.object({ nombre: z.string() });
const defaults = { nombre: '' };

describe('useForm', () => {
  it('keeps values and the dialog open when saving fails', async () => {
    const onClose = vi.fn();
    const save = vi.fn().mockRejectedValue(new Error('Unavailable'));
    const { result } = renderHook(() => useForm(schema, defaults));
    expect(result.current.formState.errors).toEqual({});
    act(() => result.current.setValue('nombre', 'Ana'));
    await act(async () => { await result.current.submitForm(save, onClose)(); });
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.getValues('nombre')).toBe('Ana');
    expect(result.current.formState.errors.root?.message).toBeTruthy();
  });

  it('closes only after the server confirms success', async () => {
    const onClose = vi.fn();
    let resolveSave!: () => void;
    const save = vi.fn(() => new Promise<void>(resolve => { resolveSave = resolve; }));
    const { result } = renderHook(() => useForm(schema, defaults));
    expect(result.current.formState.isSubmitting).toBe(false);
    let pending!: Promise<void>;
    await act(async () => { pending = result.current.submitForm(save, onClose)(); });
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.formState.isSubmitting).toBe(true);
    await act(async () => { resolveSave(); await pending; });
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('loads the selected entity when it changes after mounting', () => {
    const { result, rerender } = renderHook(
      ({ entity }) => useForm(schema, defaults, entity),
      { initialProps: { entity: null as { nombre: string } | null } },
    );
    rerender({ entity: { nombre: 'Ana' } });
    expect(result.current.getValues('nombre')).toBe('Ana');
    rerender({ entity: { nombre: 'Luis' } });
    expect(result.current.getValues('nombre')).toBe('Luis');
  });

  it('resets to defaults when leaving edit mode', () => {
    const { result, rerender } = renderHook(
      ({ entity }) => useForm(schema, defaults, entity),
      { initialProps: { entity: { nombre: 'Ana' } as { nombre: string } | null } },
    );
    act(() => result.current.setValue('nombre', 'Cambio pendiente'));
    rerender({ entity: null });
    expect(result.current.getValues('nombre')).toBe('');
  });
});
