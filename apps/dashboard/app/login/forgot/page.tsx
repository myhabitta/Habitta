import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: 'Recuperar contraseña | Habitta Dashboard',
};

const ForgotPasswordPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            Habitta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Recuperar contraseña</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
