import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PuntosParadaList } from './PuntosParadaList';
import { rutaDefault } from '../../config/defaults/ruta';
import type { RutaFormData } from '../../api/types';

const RouteFields = ({ save }: { save: (values: RutaFormData) => void }) => {
  const { control, handleSubmit } = useForm<RutaFormData>({ defaultValues: { ...rutaDefault, puntosParada: [{ nombre: 'Punto inicial', direccion: 'Dirección inicial' }] } });
  return <form onSubmit={handleSubmit(save)}><PuntosParadaList control={control} /><button type="submit">Guardar</button></form>;
};

afterEach(cleanup);

describe('PuntosParadaList', () => {
  it('registers names and addresses and persists newly added fields', async () => {
    const save = vi.fn();
    render(<RouteFields save={save} />);
    fireEvent.change(screen.getByLabelText('Punto 1'), { target: { value: 'Nuevo punto' } });
    fireEvent.change(screen.getByLabelText('Dirección 1'), { target: { value: 'Nueva dirección' } });
    fireEvent.click(screen.getByText('Agregar Punto'));
    fireEvent.change(screen.getByLabelText('Punto 2'), { target: { value: 'Segundo punto' } });
    fireEvent.change(screen.getByLabelText('Dirección 2'), { target: { value: 'Segunda dirección' } });
    fireEvent.click(screen.getByText('Guardar'));
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    expect(save.mock.calls[0][0].puntosParada).toEqual([
      { nombre: 'Nuevo punto', direccion: 'Nueva dirección' },
      { nombre: 'Segundo punto', direccion: 'Segunda dirección' },
    ]);
  });
});
