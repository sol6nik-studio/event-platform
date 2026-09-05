import type { Metadata } from 'next';
import { DashboardHeader } from '../../components/dashboard/dashboard-header';
import { DashboardPrimaryGrid } from '../../components/dashboard/dashboard-primary-grid';
import { DashboardPriority } from '../../components/dashboard/dashboard-priority';
import { DashboardSecondaryGrid } from '../../components/dashboard/dashboard-secondary-grid';
import { ProfileShell } from '../../components/profile-shell';

export const metadata: Metadata = {
  title: 'Личный кабинет',
  description: 'Ближайшие матчи, сроки и действия игрока ARENA GRID.',
};

export default function DashboardPage() {
  return (
    <ProfileShell active="dashboard">
      <DashboardHeader />
      <DashboardPriority />
      <DashboardPrimaryGrid />
      <DashboardSecondaryGrid />
    </ProfileShell>
  );
}
