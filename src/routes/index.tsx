import type { RouteObject } from 'react-router-dom';
import authRoutes from './auth';
import publicRoutes from './public';
import studentRoutes from './student';
import teacherRoutes from './teacher';

/**
 * Main Routes Configuration
 * Combines all route modules for the application
 * 
 * Route Organization:
 * - authRoutes: Authentication pages (no layout)
 * - publicRoutes: Public pages (with MainLayout)
 * - studentRoutes: Student dashboard (custom layout)
 * - teacherRoutes: Teacher dashboard (custom layout)
 */

const routes: RouteObject[] = [
  ...authRoutes,
  ...studentRoutes,
  ...teacherRoutes,
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
  const teacherPaths = teacherRoutes.map(route => route.path);
  const noLayoutPaths = [...authPaths, ...studentPaths, ...teacherPaths];
  return noLayoutPaths.includes(pathname);
};
