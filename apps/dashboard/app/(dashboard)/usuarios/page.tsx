import { getProfiles, getAllUsers, getAuthUser } from '@habitta/database';
import type { Metadata } from 'next';
import UsersTable from './UsersTable';
import CreateUserDialog from './CreateUserDialog';

export const metadata: Metadata = {
  title: 'Usuarios | Habitta Dashboard',
};

const UsuariosPage = async () => {
  const currentUser = await getAuthUser();

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No tienes acceso a esta sección.</p>
      </div>
    );
  }

  const [profiles, authUsers] = await Promise.all([getProfiles(), getAllUsers()]);

  // Map from authUsers as base — catches users without profiles too
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const users = authUsers.map((authUser) => {
    const profile = profileMap.get(authUser.id);
    return {
      id: authUser.id,
      email: authUser.email,
      full_name: profile?.full_name ?? authUser.full_name ?? '',
      role: profile?.role ?? authUser.role ?? 'user',
      created_at: profile?.created_at ?? null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <UsersTable users={users} currentUserId={currentUser.id} />
    </div>
  );
};

export default UsuariosPage;
