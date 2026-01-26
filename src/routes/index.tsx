import type { RouteObject } from "react-router-dom";
import authRoutes from "./auth";
import publicRoutes from "./public";
import studentRoutes from "./student";
import teacherRoutes from "./teacher";
import adminRoutes from "./admin";

/**
 * Main Routes Configuration
 * Combines all route modules for the application
 *
 * Route Organization:
 * - authRoutes: Authentication pages (no layout)
 * - publicRoutes: Public pages (with MainLayout)
 * - studentRoutes: Student dashboard (custom layout)
 * - teacherRoutes: Teacher dashboard (custom layout)
 * - adminRoutes: Admin dashboard (custom layout)
 */

const routes: RouteObject[] = [
  ...authRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...adminRoutes,
  ...publicRoutes,
];

export default routes;

/**
 * Convert route path pattern to regex for matching
 * e.g., '/teacher/courses/:id/edit' -> /^\/teacher\/courses\/[^/]+\/edit$/
 */
const pathToRegex = (path: string): RegExp => {
  const regexPattern = path
    .replace(/:[^/]+/g, "[^/]+") // Replace :param with regex
    .replace(/\//g, "\\/"); // Escape slashes
  return new RegExp(`^${regexPattern}$`);
};

/**
 * Helper to check if a path should NOT have MainLayout
 * Returns true for auth pages and dashboard pages
 */
export const isAuthPath = (pathname: string): boolean => {
  const authPaths = authRoutes
    .map((route) => route.path)
    .filter(Boolean) as string[];
  const studentPaths = studentRoutes
    .map((route) => route.path)
    .filter(Boolean) as string[];
  const teacherPaths = teacherRoutes
    .map((route) => route.path)
    .filter(Boolean) as string[];
  const adminPaths = adminRoutes
    .map((route) => route.path)
    .filter(Boolean) as string[];
  const noLayoutPaths = [
    ...authPaths,
    ...studentPaths,
    ...teacherPaths,
    ...adminPaths,
  ];

  return noLayoutPaths.some((routePath) => {
    const regex = pathToRegex(routePath);
    return regex.test(pathname);
  });
};
