import type { Metadata } from 'next';
import { AuthForm } from '../../../components/auth-form';
import { AuthShell } from '../../../components/auth-shell';

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт игрока ARENA GRID.',
};

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
