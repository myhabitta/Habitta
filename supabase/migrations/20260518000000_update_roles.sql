-- Update role check constraint to support new 3-tier role system
-- Old: admin, sales
-- New: super_admin, admin, user

-- 1. Drop old constraint
ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;

-- 2. Add new constraint with updated roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('super_admin', 'admin', 'user'));

-- 3. Migrate existing roles: sales → user
UPDATE profiles SET role = 'user' WHERE role = 'sales';

-- 4. Set Bryan as super_admin
UPDATE profiles SET role = 'super_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'bryanvillamilacevedo@gmail.com');

-- 5. Update the trigger function for new users to default to 'user'
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update RLS to allow super_admin to view all profiles too
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON profiles;
CREATE POLICY "admins_can_view_all_profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR (auth.jwt() ->> 'role') IN ('admin', 'super_admin')
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
  );
