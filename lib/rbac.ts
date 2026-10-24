export type Role = 'PRINCIPAL' | 'ACCOUNTANT' | 'TEACHER' | 'PARENT' | 'STUDENT';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'MANAGE_STUDENTS'
  | 'VIEW_STUDENTS'
  | 'MANAGE_ADMISSIONS'
  | 'MANAGE_ATTENDANCE'
  | 'VIEW_ATTENDANCE'
  | 'MANAGE_FEES'
  | 'VIEW_FEES'
  | 'MANAGE_EXAMS'
  | 'VIEW_EXAMS'
  | 'MANAGE_NOTICES'
  | 'VIEW_PARENT_PORTAL'
  | 'MANAGE_SETTINGS';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  PRINCIPAL: [
    'VIEW_DASHBOARD',
    'MANAGE_STUDENTS',
    'VIEW_STUDENTS',
    'MANAGE_ADMISSIONS',
    'MANAGE_ATTENDANCE',
    'VIEW_ATTENDANCE',
    'MANAGE_FEES',
    'VIEW_FEES',
    'MANAGE_EXAMS',
    'VIEW_EXAMS',
    'MANAGE_NOTICES',
    'VIEW_PARENT_PORTAL',
    'MANAGE_SETTINGS',
  ],
  ACCOUNTANT: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'MANAGE_FEES',
    'VIEW_FEES',
    'MANAGE_ADMISSIONS',
    'VIEW_ATTENDANCE',
    'MANAGE_NOTICES',
  ],
  TEACHER: [
    'VIEW_DASHBOARD',
    'VIEW_STUDENTS',
    'MANAGE_ATTENDANCE',
    'VIEW_ATTENDANCE',
    'MANAGE_EXAMS',
    'VIEW_EXAMS',
    'MANAGE_NOTICES',
  ],
  PARENT: [
    'VIEW_DASHBOARD',
    'VIEW_ATTENDANCE',
    'VIEW_FEES',
    'VIEW_EXAMS',
    'VIEW_PARENT_PORTAL',
  ],
  STUDENT: [
    'VIEW_DASHBOARD',
    'VIEW_ATTENDANCE',
    'VIEW_FEES',
    'VIEW_EXAMS',
    'VIEW_PARENT_PORTAL',
  ],
};

export function hasPermission(role: Role | string, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role as Role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

// Route to Required Permission Mapping
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/students': 'VIEW_STUDENTS',
  '/admissions': 'MANAGE_ADMISSIONS',
  '/attendance': 'VIEW_ATTENDANCE',
  '/fees': 'VIEW_FEES',
  '/examinations': 'VIEW_EXAMS',
  '/parent-portal': 'VIEW_PARENT_PORTAL',
};

export function canAccessRoute(role: Role | string, pathname: string): boolean {
  if (role === 'PRINCIPAL') return true;
  if (pathname === '/' || pathname === '/login') return true;

  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return hasPermission(role, permission);
    }
  }

  return true;
}
