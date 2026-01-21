import type { RouteObject } from 'react-router-dom';
import authRoutes from './auth';
import publicRoutes from './public';

/**
 * Main Routes Configuration
 * Combines all route modules for the application
 * 
 * Route Organization:
 * - authRoutes: Authentication pages (no layout)
 * - publicRoutes: Public pages (with MainLayout)
 * 
 * Future: Add more route modules as needed:
 * - adminRoutes: Admin dashboard routes
 * - teacherRoutes: Teacher-specific routes
 * - studentRoutes: Student dashboard routes
 */

const routes: RouteObject[] = [
  ...authRoutes,
  ...publicRoutes,
  // Future route modules can be added here:
  // ...adminRoutes,
  // ...teacherRoutes,
  // ...studentRoutes,
];

export default routes;

/**
 * Helper to check if a path is an auth page (for layout logic)
 */
export const isAuthPath = (pathname: string): boolean => {
  const authPaths = authRoutes.map(route => route.path);
  return authPaths.includes(pathname);
};
