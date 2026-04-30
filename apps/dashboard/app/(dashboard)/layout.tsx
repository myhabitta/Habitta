import { redirect } from 'next/navigation';
import { getAuthUser } from '@habitta/database';
import DashboardShell from '@/components/layout/DashboardShell';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) redirect('/login');

  return (
    <DashboardShell user={user}>
      {children}
      <footer className="pt-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Habitta. Todos los derechos reservados.
        </p>
      </footer>
    </DashboardShell>
  );
}
