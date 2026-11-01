import { DashboardLayout } from '@/shared/components/organisms/DashboardLayout';
import { KPICards } from '../components/KPICards';
import { Charts } from '../components/Charts';

export const DashboardPage = () => {
  return (
    <DashboardLayout title="Dashboard">
      <KPICards />
      <Charts />
    </DashboardLayout>
  );
}
