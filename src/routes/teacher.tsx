import type { RouteObject } from 'react-router-dom';
import TeacherLayout from '../layouts/TeacherLayout';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';
import CourseListPage from '../pages/teacher/CourseListPage';
import CourseBuilderPage from '../pages/teacher/CourseBuilderPage';
import StudentListPage from '../pages/teacher/StudentListPage';
import StudentDetailPage from '../pages/teacher/StudentDetailPage';
import QuestionBankPage from '../pages/teacher/QuestionBankPage';
import QuestionFormPage from '../pages/teacher/QuestionFormPage';
import ExamListPage from '../pages/teacher/ExamListPage';
import ExamFormPage from '../pages/teacher/ExamFormPage';

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
        <CourseListPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/courses/new',
    element: <CourseBuilderPage />
  },
  {
    path: '/teacher/courses/:id/edit',
    element: <CourseBuilderPage />
  },
  {
    path: '/teacher/questions',
    element: (
      <TeacherLayout>
        <QuestionBankPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/questions/new',
    element: (
      <TeacherLayout>
        <QuestionFormPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/questions/:id/edit',
    element: (
      <TeacherLayout>
        <QuestionFormPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/exams',
    element: (
      <TeacherLayout>
        <ExamListPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/exams/new',
    element: (
      <TeacherLayout>
        <ExamFormPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/exams/:id/edit',
    element: (
      <TeacherLayout>
        <ExamFormPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/students',
    element: (
      <TeacherLayout>
        <StudentListPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/students/:id',
    element: (
      <TeacherLayout>
        <StudentDetailPage />
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/reports',
    element: (
      <TeacherLayout>
        <div className="text-[#111518]">Trang Báo cáo - Coming Soon</div>
      </TeacherLayout>
    )
  },
  {
    path: '/teacher/settings',
    element: (
      <TeacherLayout>
        <div className="text-[#111518]">Trang Cài đặt - Coming Soon</div>
      </TeacherLayout>
    )
  }
];

export default teacherRoutes;


