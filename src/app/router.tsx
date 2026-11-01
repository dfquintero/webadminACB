import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProtectedRoute } from '@/shared/providers/ProtectedRoute';
import { AppLayout } from '@/shared/components/organisms/AppLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { EstudiantesPage } from '@/features/estudiantes/pages/EstudiantesPage';
import { RutasPage } from '@/features/rutas/pages/RutasPage';
import { GuiasPage } from '@/features/guias/pages/GuiasPage';
import { AsignacionesPage } from '@/features/asignaciones/pages/AsignacionesPage';
import { AsistenciaPage } from '@/features/asistencia/pages/AsistenciaPage';
import { AlertasPage } from '@/features/alertas/pages/AlertasPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/estudiantes" element={<EstudiantesPage />} />
        <Route path="/rutas" element={<RutasPage />} />
        <Route path="/guias" element={<GuiasPage />} />
        <Route path="/asignaciones" element={<AsignacionesPage />} />
        <Route path="/asistencia" element={<AsistenciaPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
