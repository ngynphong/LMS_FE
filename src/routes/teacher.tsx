import type { RouteObject } from 'react-router-dom';
import TeacherLayout from '../layouts/TeacherLayout';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';

/**
 * Teacher Routes
 * Protected routes for authenticated teachers
 * TODO: Add ProtectedRoute wrapper with role check
 */
const teacherRoutes: RouteObject[] = [
  {
    path: '/teacher/dashboard',
    element: (
      <TeacherLayout>
        <TeacherDashboardPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/courses',
    element: (
      <TeacherLayout>
        <div className="text-[#111518] dark:text-white">Trang Khóa học - Coming Soon</div>
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/students',
    element: (
      <TeacherLayout>
        <div className="text-[#111518] dark:text-white">Trang Học viên - Coming Soon</div>
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/reports',
    element: (
      <TeacherLayout>
        <div className="text-[#111518] dark:text-white">Trang Báo cáo - Coming Soon</div>
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/settings',
    element: (
      <TeacherLayout>
        <div className="text-[#111518] dark:text-white">Trang Cài đặt - Coming Soon</div>
      </TeacherLayout>
    )
  }
];

export default teacherRoutes;
