import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: 'Login | Habitta Dashboard',
};

const LoginPage = () => {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center">
      {/* ThemeToggle esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Card de login */}
      <div className="w-full max-w-sm mx-auto px-6">
        {/* Logo / nombre */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
            Habitta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
