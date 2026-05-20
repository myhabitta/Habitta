'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { forgotPasswordAction } from './actions';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-white" disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Enviando...
        </span>
      ) : (
        'Enviar enlace de recuperación'
      )}
    </Button>
  );
};

const ForgotPasswordForm = () => {
  const [state, action] = useActionState(forgotPasswordAction, null);

  if (state && 'success' in state) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">{state.success}</p>
        <Link href="/login" className="text-sm text-foreground underline hover:no-underline">
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

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

      {state && 'error' in state && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton />

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Volver al login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
