import type { RouteObject } from "react-router-dom";
import TeacherLayout from "../layouts/TeacherLayout";
import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";
import CourseListPage from "../pages/teacher/CourseListPage";
import CourseBuilderPage from "../pages/teacher/CourseBuilderPage";
import StudentListPage from "../pages/teacher/StudentListPage";
import StudentDetailPage from "../pages/teacher/StudentDetailPage";
import QuestionBankPage from "../pages/teacher/QuestionBankPage";
import QuestionFormPage from "../pages/teacher/QuestionFormPage";
import ExamListPage from "../pages/teacher/ExamListPage";
import ExamFormPage from "../pages/teacher/ExamFormPage";
import ReportsListPage from "../pages/teacher/ReportsListPage";
import ExamReportDetailPage from "../pages/teacher/ExamReportDetailPage";

/**
 * Teacher Routes
 * Protected routes for authenticated teachers
 * TODO: Add ProtectedRoute wrapper with role check
 */

const finalTeacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
      { path: "dashboard", element: <TeacherDashboardPage /> },
      { path: "courses", element: <CourseListPage /> },
      { path: "questions", element: <QuestionBankPage /> },
      { path: "questions/new", element: <QuestionFormPage /> },
      { path: "questions/:id/edit", element: <QuestionFormPage /> },
      { path: "exams", element: <ExamListPage /> },
      { path: "exams/new", element: <ExamFormPage /> },
      { path: "exams/:id/edit", element: <ExamFormPage /> },
      { path: "students", element: <StudentListPage /> },
      { path: "students/:id", element: <StudentDetailPage /> },
      { path: "reports", element: <ReportsListPage /> },
      { path: "reports/:id", element: <ExamReportDetailPage /> },
      {
        path: "settings",
        element: (
          <div className="text-[#111518]">Trang Cài đặt - Coming Soon</div>
        ),
      },
    ],
  },
  {
    path: "/teacher/courses/new",
    element: <CourseBuilderPage />,
  },
  {
    path: "/teacher/courses/:id/edit",
    element: <CourseBuilderPage />,
  },
];

export default finalTeacherRoutes;
