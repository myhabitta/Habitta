'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { loginAction } from './actions';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-white" disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Iniciando sesión...
        </span>
      ) : (
        'Iniciar sesión'
      )}
    </Button>
  );
};

const LoginForm = () => {
  const [state, action] = useActionState(loginAction, null);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tu@gmail.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <SubmitButton />

      <div className="text-center">
        <Link
          href="/login/forgot"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
