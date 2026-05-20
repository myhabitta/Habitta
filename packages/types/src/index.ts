export type { Project, ProjectWithClientCount } from './project';
export type { Package } from './package';
export type {
  Lead,
  LeadNote,
  LeadStatus,
  LeadWithRelations,
  CreateLeadInput,
  UpdateLeadInput,
  ConvertLeadInput,
} from './lead';
export type {
  Client,
  ClientWithRelations,
  ClientStats,
  ClientStatus,
  ConstructionPhase,
  UpdateClientInput,
} from './client';
export { PHASE_LABELS, PHASE_SHORT_LABELS, PHASE_COLORS } from './client';
export type { ClientPayment, CreateClientPaymentInput } from './payment';
export type { Database, Tables, TablesInsert, TablesUpdate, Json } from './supabase';
export type { Profile, UserRole } from './profile';
export type { AuthUser } from './auth';
export type {
  MonthlyRevenue,
  PackagePerformance,
  ProjectPerformance,
  DashboardMetrics,
} from './metrics';
export type { EmailLog, EmailLogStatus } from './emailLog';
