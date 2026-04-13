'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import type { AuthUser } from '@habitta/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: AuthUser['role'][];
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  {
    label: 'Inicio',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'sales'],
  },
  {
    label: 'Proyectos',
    href: '/dashboard/projects',
    icon: Building2,
    roles: ['admin'],
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
    roles: ['admin', 'sales'],
  },
  {
    label: 'Clientes',
    href: '/dashboard/clients',
    icon: UserCheck,
    roles: ['admin', 'sales'],
  },
  {
    label: 'Métricas',
    href: '/dashboard/metrics',
    icon: BarChart3,
    roles: ['admin'],
  },
];

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

const isItemActive = (pathname: string, href: string): boolean => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname === href || pathname.startsWith(href + '/');
};

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar = ({ user, isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));
  const initials = getInitials(user.full_name, user.email);
  const displayName = user.full_name?.trim() || user.email;

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-30 flex h-screen w-[260px] shrink-0 flex-col',
        'border-r border-habitta-sidebar-border bg-habitta-sidebar-bg',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:static md:translate-x-0',
      ].join(' ')}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="px-6 pb-5 pt-7">
        <img
          src="https://res.cloudinary.com/dcpkaidzl/image/upload/q_auto/f_auto/v1775624499/Logotipo-positivo_s7xhks.webp"
          alt="Habitta"
          className="h-8 w-auto"
        />
        <span className="mt-1.5 block font-sans text-[11px] font-medium uppercase tracking-widest text-habitta-sidebar-text opacity-70">
          Panel de gestión
        </span>
      </div>

      {/* ── Divisor ───────────────────────────────────────────────────────── */}
      <div className="mx-5 mb-4 h-px bg-habitta-sidebar-border" />

      {/* ── Navegación ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3" aria-label="Navegación principal">
        <ul className="flex flex-col gap-0.5">
          {visibleItems.map((item) => {
            const active = isItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 font-sans text-sm',
                    active
                      ? 'font-semibold text-[var(--habitta-accent)]'
                      : 'font-medium text-habitta-sidebar-text hover:bg-black/5 hover:text-habitta-sidebar-text-active dark:hover:bg-white/5',
                  ].join(' ')}
                  style={
                    active
                      ? {
                          backgroundColor:
                            'color-mix(in srgb, var(--habitta-accent) 10%, transparent)',
                        }
                      : undefined
                  }
                >
                  {/* Borde izquierdo activo */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
                      style={{ backgroundColor: 'var(--habitta-accent)' }}
                      aria-hidden="true"
                    />
                  )}

                  <Icon
                    size={17}
                    aria-hidden="true"
                    style={active ? { color: 'var(--habitta-accent)' } : { opacity: 0.55 }}
                  />

                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Usuario ───────────────────────────────────────────────────────── */}
      <div className="border-t border-habitta-sidebar-border p-4">
        <div className="flex items-center gap-3">
          {/* Avatar con iniciales */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: 'var(--habitta-accent)' }}
            aria-hidden="true"
          >
            {initials}
          </div>

          {/* Info del usuario */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-sans text-sm font-semibold text-habitta-sidebar-text-active">
                {displayName}
              </span>

              {/* Badge de rol */}
              {user.role === 'admin' ? (
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 font-sans text-[10px] font-semibold"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--habitta-accent) 12%, transparent)',
                    color: 'var(--habitta-accent)',
                  }}
                >
                  Admin
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted-foreground">
                  Ventas
                </span>
              )}
            </div>

            <span className="block truncate font-sans text-xs text-habitta-sidebar-text">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
