// Interfaces for API responses
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FullHistoryResponse {
  history: any[];
  allergies: any[];
  medications: any[];
  familyHistory: any[];
  lifestyle: any | null;
}

export interface AccessPermissions {
  fisico: boolean;
  mental: boolean;
}

export interface MedicalAccessGrant {
  id: bigint;
  patientId: bigint;
  staffId: bigint;
  permissions: AccessPermissions;
  grantedAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
}

// Type guards
export function isAccessExpired(grant: MedicalAccessGrant): boolean {
  if (!grant.expiresAt) return false;
  return new Date() > grant.expiresAt;
}

export function hasPermissionForType(
  permissions: AccessPermissions,
  type: 'fisico' | 'mental'
): boolean {
  return permissions[type] === true;
}
