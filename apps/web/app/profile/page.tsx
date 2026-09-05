import type { Metadata } from 'next';
import { ProfileEditor } from '../../components/profile-editor';
import { ProfileShell } from '../../components/profile-shell';
import { getProfileTab } from '../../lib/profile-tabs';

export const metadata: Metadata = {
  title: 'Настройки профиля',
  description: 'Профиль, игровые аккаунты, уведомления, безопасность и приватность ARENA GRID.',
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;

  return (
    <ProfileShell>
      <ProfileEditor initialTab={getProfileTab(tab)} />
    </ProfileShell>
  );
}
