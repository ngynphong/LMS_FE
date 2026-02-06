import React from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const TeacherLayout = React.lazy(() => import("../layouts/TeacherLayout"));
const TeacherDashboardPage = React.lazy(
  () => import("../pages/teacher/TeacherDashboardPage"),
);
const CourseListPage = React.lazy(
  () => import("../pages/teacher/CourseListPage"),
);
const CourseBuilderPage = React.lazy(
  () => import("../pages/teacher/CourseBuilderPage"),
);
const TeacherCourseDetailPage = React.lazy(
  () => import("../pages/teacher/TeacherCourseDetailPage"),
);
const StudentListPage = React.lazy(
  () => import("../pages/teacher/StudentListPage"),
);
const StudentDetailPage = React.lazy(
  () => import("../pages/teacher/StudentDetailPage"),
);
const QuestionBankPage = React.lazy(
  () => import("../pages/teacher/QuestionBankPage"),
);
const QuestionFormPage = React.lazy(
  () => import("../pages/teacher/QuestionFormPage"),
);
const ExamListPage = React.lazy(() => import("../pages/teacher/ExamListPage"));
const ExamFormPage = React.lazy(() => import("../pages/teacher/ExamFormPage"));
const ReportsListPage = React.lazy(
  () => import("../pages/teacher/ReportsListPage"),
);
const ExamReportDetailPage = React.lazy(
  () => import("../pages/teacher/ExamReportDetailPage"),
);
const TeacherLessonItemPreviewPage = React.lazy(
  () => import("../pages/teacher/TeacherLessonItemPreviewPage"),
);
const TeacherSettingsPage = React.lazy(
  () => import("../pages/teacher/TeacherSettingsPage"),
);

/**
 * Teacher Routes
 * Protected routes for authenticated teachers
 */

const finalTeacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <TeacherDashboardPage /> },
      { path: "courses", element: <CourseListPage /> },
      { path: "courses/:id", element: <TeacherCourseDetailPage /> },
      { path: "questions", element: <QuestionBankPage /> },
      { path: "questions/new", element: <QuestionFormPage /> },
      { path: "questions/:id/edit", element: <QuestionFormPage /> },
      { path: "quizzes", element: <ExamListPage /> },
      { path: "quizzes/new", element: <ExamFormPage /> },
      { path: "quizzes/:id/edit", element: <ExamFormPage /> },
      { path: "students", element: <StudentListPage /> },
      { path: "students/:id", element: <StudentDetailPage /> },
      { path: "reports", element: <ReportsListPage /> },
      { path: "reports/:id", element: <ExamReportDetailPage /> },
      { path: "settings", element: <TeacherSettingsPage /> },
    ],
  },
  {
    path: "/teacher/courses/new",
    element: (
      <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
        <CourseBuilderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/courses/:id/edit",
    element: (
      <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
        <CourseBuilderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/courses/:courseId/lessons/:lessonId/items/:itemId",
    element: (
      <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
        <TeacherLessonItemPreviewPage />
      </ProtectedRoute>
    ),
  },
];

export default finalTeacherRoutes;
