import type {
  MonthlyRevenue,
  PackagePerformance,
  ProjectPerformance,
  DashboardMetrics,
} from '@habitta/types';

import { createServerClient } from '../client';

type ClientRow = {
  id: string;
  total_amount: number | null;
  created_at: string | null;
};

type ClientWithJoins = {
  total_amount: number | null;
  package: { id: string; name: string } | null;
  project: { name: string } | null;
};

type LeadRow = {
  id: string;
  project_id: string | null;
  created_at: string | null;
};

type ClientProjectRow = {
  id: string;
  project_id: string | null;
  total_amount: number | null;
};

type ProjectRow = {
  id: string;
  name: string;
  city: string | null;
};

export const getMonthlyRevenue = async (months: number = 6): Promise<MonthlyRevenue[]> => {
  const supabase = createServerClient();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const { data, error } = await supabase
    .from('clients')
    .select('id, total_amount, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[getMonthlyRevenue]', error);
    return [];
  }

  const rows = (data ?? []) as ClientRow[];

  // Generar todos los meses del rango
  const monthsMap = new Map<string, { revenue: number; clients: number }>();
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthsMap.set(key, { revenue: 0, clients: 0 });
  }

  // Acumular datos reales
  for (const row of rows) {
    if (!row.created_at) continue;
    const d = new Date(row.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthsMap.has(key)) {
      const entry = monthsMap.get(key)!;
      entry.revenue += row.total_amount ?? 0;
      entry.clients += 1;
    }
  }

  // Convertir a array con label en español
  return Array.from(monthsMap.entries()).map(([month, { revenue, clients }]) => {
    const [year, monthNum] = month.split('-');
    const d = new Date(Number(year), Number(monthNum) - 1, 1);
    const raw = new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric' }).format(d);
    const label = raw.charAt(0).toUpperCase() + raw.slice(1);
    return { month, label, revenue, clients };
  });
};

export const getPackagePerformance = async (): Promise<PackagePerformance[]> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select('total_amount, package:packages(id, name), project:projects(name)');

  if (error) {
    console.error('[getPackagePerformance]', error);
    return [];
  }

  const rows = (data ?? []) as ClientWithJoins[];

  // Agrupar por package_id en memoria
  const map = new Map<string, PackagePerformance>();

  for (const row of rows) {
    const pkg = row.package as { id: string; name: string } | null;
    const proj = row.project as { name: string } | null;
    if (!pkg) continue;

    if (!map.has(pkg.id)) {
      map.set(pkg.id, {
        package_id: pkg.id,
        package_name: pkg.name,
        project_name: proj?.name ?? '—',
        total_sold: 0,
        total_revenue: 0,
        percentage: 0,
      });
    }
    const entry = map.get(pkg.id)!;
    entry.total_sold += 1;
    entry.total_revenue += row.total_amount ?? 0;
  }

  const result = Array.from(map.values()).sort((a, b) => b.total_sold - a.total_sold);

  // Calcular percentage
  const grandTotal = result.reduce((sum, r) => sum + r.total_revenue, 0);
  if (grandTotal > 0) {
    for (const r of result) {
      r.percentage = Math.round((r.total_revenue / grandTotal) * 100);
    }
  }

  return result;
};

export const getProjectPerformance = async (): Promise<ProjectPerformance[]> => {
  const supabase = createServerClient();

  const [projectsResult, leadsResult, clientsResult] = await Promise.all([
    supabase.from('projects').select('id, name, city'),
    supabase.from('leads').select('id, project_id'),
    supabase.from('clients').select('id, project_id, total_amount'),
  ]);

  if (projectsResult.error) {
    console.error('[getProjectPerformance] projects', projectsResult.error);
    return [];
  }

  const projects = (projectsResult.data ?? []) as ProjectRow[];
  const leads = (leadsResult.data ?? []) as LeadRow[];
  const clients = (clientsResult.data ?? []) as ClientProjectRow[];

  return projects
    .map((project) => {
      const projectLeads = leads.filter((l) => l.project_id === project.id);
      const projectClients = clients.filter((c) => c.project_id === project.id);
      const total_revenue = projectClients.reduce((sum, c) => sum + (c.total_amount ?? 0), 0);
      const conversion_rate =
        projectLeads.length > 0
          ? Math.round((projectClients.length / projectLeads.length) * 100)
          : 0;

      return {
        project_id: project.id,
        project_name: project.name,
        city: project.city ?? '—',
        total_leads: projectLeads.length,
        total_clients: projectClients.length,
        total_revenue,
        conversion_rate,
      };
    })
    .sort((a, b) => b.total_revenue - a.total_revenue);
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const supabase = createServerClient();

  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastDayLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  ).toISOString();

  const [leadsResult, clientsResult, packagePerf, projectPerf] = await Promise.all([
    supabase.from('leads').select('id, created_at'),
    supabase.from('clients').select('id, total_amount, created_at'),
    getPackagePerformance(),
    getProjectPerformance(),
  ]);

  const leads = (leadsResult.data ?? []) as Pick<LeadRow, 'id' | 'created_at'>[];
  const clients = (clientsResult.data ?? []) as ClientRow[];

  const leadsThisMonth = leads.filter((l) => (l.created_at ?? '') >= firstDayThisMonth).length;
  const clientsThisMonth = clients.filter(
    (c) => (c.created_at ?? '') >= firstDayThisMonth
  ).length;

  const totalRevenue = clients.reduce((sum, c) => sum + (c.total_amount ?? 0), 0);
  const revenueThisMonth = clients
    .filter((c) => (c.created_at ?? '') >= firstDayThisMonth)
    .reduce((sum, c) => sum + (c.total_amount ?? 0), 0);
  const revenueLastMonth = clients
    .filter((c) => {
      const d = c.created_at ?? '';
      return d >= firstDayLastMonth && d <= lastDayLastMonth;
    })
    .reduce((sum, c) => sum + (c.total_amount ?? 0), 0);

  const growthPercentage =
    revenueLastMonth > 0
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 1000) / 10
      : 0;

  const averageTicket = clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;
  const conversionRate =
    leads.length > 0 ? Math.round((clients.length / leads.length) * 100) : 0;

  return {
    revenue: {
      total: totalRevenue,
      thisMonth: revenueThisMonth,
      lastMonth: revenueLastMonth,
      growthPercentage,
    },
    leads: {
      total: leads.length,
      thisMonth: leadsThisMonth,
      conversionRate,
    },
    clients: {
      total: clients.length,
      thisMonth: clientsThisMonth,
      averageTicket,
    },
    topPackage: packagePerf[0] ?? null,
    topProject: projectPerf[0] ?? null,
  };
};
