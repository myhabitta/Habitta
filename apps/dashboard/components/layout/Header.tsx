'use client';

import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { LogOut, Menu } from 'lucide-react';
import type { AuthUser } from '@habitta/types';

import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { logoutAction } from '@/app/(dashboard)/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  user: AuthUser;
  onMenuToggle: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Inicio',
  '/projects': 'Proyectos',
  '/leads': 'Leads',
  '/clients': 'Clientes',
  '/metrics': 'Métricas',
  '/usuarios': 'Usuarios',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (fullName: string | undefined, email: string): string => {
  if (fullName) {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
};

// ─── Component ────────────────────────────────────────────────────────────────

const Header = ({ user, onMenuToggle }: HeaderProps) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const title = ROUTE_TITLES[pathname] ?? 'Dashboard';
  const displayName = user.full_name?.trim() || user.email;
  const initials = getInitials(user.full_name, user.email);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
      {/* ── Izquierda ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-primary md:text-xl">{title}</h1>
      </div>

      {/* ── Derecha ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <span className="hidden font-sans text-sm text-muted-foreground md:block">
          {displayName}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-full font-sans text-xs font-bold text-white ring-offset-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ backgroundColor: 'var(--habitta-accent)' }}
              aria-label="Menú de usuario"
            >
              {initials}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-sm font-semibold text-foreground">
                  {displayName}
                </span>
                <span className="font-sans text-xs text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() =>
                startTransition(() => {
                  logoutAction();
                })
              }
              disabled={isPending}
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            >
              <LogOut size={14} aria-hidden="true" />
              {isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
