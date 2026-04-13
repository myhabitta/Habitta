import { getProfiles, getAllUsers, getAuthUser } from '@habitta/database';
import type { Metadata } from 'next';
import UserCard from './UserCard';

export const metadata: Metadata = {
  title: 'Usuarios | Habitta Dashboard',
};

const UsuariosPage = async () => {
  const currentUser = await getAuthUser();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No tienes acceso a esta sección.</p>
      </div>
    );
  }

  const [profiles, authUsers] = await Promise.all([getProfiles(), getAllUsers()]);

  const users = profiles.map((profile) => {
    const authUser = authUsers.find((u) => u.id === profile.id);
    return {
      id: profile.id,
      email: authUser?.email ?? '',
      full_name: profile.full_name,
      role: profile.role,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona los usuarios y sus contraseñas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsuariosPage;
