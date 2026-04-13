export type Project = {
  id: string;
  slug: string;
  name: string;
  city: string;
  department: string;
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string | null;
  updated_at: string | null;
};

export type ProjectWithClientCount = Project & {
  client_count: number;
};
