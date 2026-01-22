import type { RouteObject } from 'react-router-dom';
import authRoutes from './auth';
import publicRoutes from './public';
import studentRoutes from './student';

/**
 * Main Routes Configuration
 * Combines all route modules for the application
 * 
 * Route Organization:
 * - authRoutes: Authentication pages (no layout)
 * - publicRoutes: Public pages (with MainLayout)
 * - studentRoutes: Student dashboard (custom layout)
 * 
 * Future: Add more route modules as needed:
 * - adminRoutes: Admin dashboard routes
 * - teacherRoutes: Teacher-specific routes
 */

const routes: RouteObject[] = [
  ...authRoutes,
  ...studentRoutes,
  ...publicRoutes,
];

export default routes;

/**
 * Helper to check if a path should NOT have MainLayout
 * Returns true for auth pages and dashboard pages
 */
export const isAuthPath = (pathname: string): boolean => {
  const authPaths = authRoutes.map(route => route.path);
  const studentPaths = studentRoutes.map(route => route.path);
  const noLayoutPaths = [...authPaths, ...studentPaths];
  return noLayoutPaths.includes(pathname);
};
