import type { RouteObject } from 'react-router-dom';
import Home from '../pages/home/Home';
import CoursesPage from '../pages/courses/CoursesPage';
import CourseDetailPage from '../pages/courses/CourseDetailPage';

/**
 * Public Routes
 * These routes use MainLayout (with header/footer)
 */
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/courses',
    element: <CoursesPage />
  },
  {
    path: '/courses/:id',
    element: <CourseDetailPage />
  },
  {
    path: '/forum',
    element: <div>Forum Page - Coming Soon</div>
  },
  {
    path: '/shop',
    element: <div>Shop Page - Coming Soon</div>
  }
];

export default publicRoutes;
