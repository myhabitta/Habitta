export { createServerClient, createBrowserClient, createMiddlewareClient, createAdminClient } from './client';
export { getSession, getAuthUser, signIn, signOut, updateUserPassword, updateUserMetadata, getAllUsers, createUser, deleteUser, resetPasswordForEmail } from './auth';

export {
  getProjects,
  getProjectsWithClientCount,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from './queries/projects';
export type { CreateProjectInput, UpdateProjectInput } from './queries/projects';

export {
  getPackagesByProject,
  getPackageBySlug,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from './queries/packages';
export type { CreatePackageInput, UpdatePackageInput } from './queries/packages';

export {
  getLeads,
  getLead,
  getLeadByShortId,
  createLead,
  updateLead,
  deleteLead,
  convertLeadToClient,
  getLeadStats,
} from './queries/leads';

export { getClients, getClient, getClientByShortId, getClientBySlug, getClientByCedula, getClientByCedulaOnly, checkSlugExists, updateClient, updateClientPhase, deleteClient, getClientStats } from './queries/clients';
export { getClientPayments, addClientPayment } from './queries/payments';

export { getProfile, updateProfile, getProfiles } from './queries/profiles';

export {
  getMonthlyRevenue,
  getPackagePerformance,
  getProjectPerformance,
  getDashboardMetrics,
} from './queries/metrics';

export { logEmail, getEmailLogsByClient } from './queries/emailLogs';
