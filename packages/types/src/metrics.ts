export type MonthlyRevenue = {
  month: string; // formato "2024-01"
  label: string; // formato "Ene 2024"
  revenue: number;
  clients: number;
};

export type PackagePerformance = {
  package_id: string;
  package_name: string;
  project_name: string;
  total_sold: number;
  total_revenue: number;
  percentage: number; // % del total de ventas
};

export type ProjectPerformance = {
  project_id: string;
  project_name: string;
  city: string;
  total_leads: number;
  total_clients: number;
  total_revenue: number;
  conversion_rate: number; // clients/leads * 100
};

export type DashboardMetrics = {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growthPercentage: number; // % crecimiento mes a mes
  };
  leads: {
    total: number;
    thisMonth: number;
    conversionRate: number;
  };
  clients: {
    total: number;
    thisMonth: number;
    averageTicket: number;
  };
  topPackage: PackagePerformance | null;
  topProject: ProjectPerformance | null;
};
