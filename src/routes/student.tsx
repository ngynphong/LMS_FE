import type { RouteObject } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';

/**
 * Student Routes  
 * Protected routes for authenticated students
 * TODO: Add ProtectedRoute wrapper with role check
 */
import StudentMyCoursesPage from '../pages/student/StudentMyCoursesPage';

/**
 * Student Routes  
 * Protected routes for authenticated students
 * TODO: Add ProtectedRoute wrapper with role check
 */
const studentRoutes: RouteObject[] = [
  {
    path: '/student/dashboard',
    element: (
      <StudentLayout>
        <StudentDashboardPage />
      </StudentLayout>
    )
  },
  {
    path: '/student/profile',
    element: (
      <StudentLayout>
        <StudentProfilePage />
      </StudentLayout>
    )
  },
  {
    path: '/student/my-courses',
    element: (
      <StudentLayout>
        <StudentMyCoursesPage />
      </StudentLayout>
    )
  },
  {
    path: '/student/schedule',
    element: (
      <StudentLayout>
        <div>Schedule Page - Coming Soon</div>
      </StudentLayout>
    )
  },
  {
    path: '/student/messages',
    element: (
      <StudentLayout>
        <div>Messages Page - Coming Soon</div>
      </StudentLayout>
    )
  },
  {
    path: '/student/certificates',
    element: (
      <StudentLayout>
        <div>Certificates Page - Coming Soon</div>
      </StudentLayout>
    )
  },
  {
    path: '/student/settings',
    element: (
      <StudentLayout>
        <div>Settings Page - Coming Soon</div>
      </StudentLayout>
    )
  }
];

export default studentRoutes;
