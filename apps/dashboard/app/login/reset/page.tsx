import type { Metadata } from 'next';
import ResetPasswordForm from './ResetPasswordForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: 'Nueva contraseña | Habitta Dashboard',
};

const ResetPasswordPage = () => {
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
          <p className="mt-2 text-sm text-muted-foreground">Establecer nueva contraseña</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
