export type Package = {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  features: string[] | null;
  delivery_days: number;
  status: 'active' | 'inactive';
  created_at: string | null;
  updated_at: string | null;
};
