export type LeadNote = {
  text: string;
  created_at: string;
  created_by: string;
};

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'converted' | 'lost';

export type Lead = {
  id: string;
  short_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  project_id: string | null;
  package_id: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type LeadWithRelations = Lead & {
  project?: { id: string; name: string; city: string } | null;
  package?: { id: string; name: string; price: number } | null;
};

export type CreateLeadInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  project_id?: string;
  package_id?: string;
  notes?: string;
};

export type UpdateLeadInput = Partial<CreateLeadInput> & {
  status?: LeadStatus;
};

export type ConvertLeadInput = {
  project_id: string;
  package_id: string;
  total_amount: number;
  work_start_date?: string | null;
  tower: string;
  apartment_number: string;
  portal_slug: string;
  cedula?: string;
};
