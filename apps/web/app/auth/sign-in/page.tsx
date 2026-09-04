import type { Metadata } from 'next';
import { AuthForm } from '../../../components/auth-form';
import { AuthShell } from '../../../components/auth-shell';

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Войдите в аккаунт ARENA GRID, чтобы управлять командой и участвовать в турнирах.',
};

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}
