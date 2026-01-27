import type { RouteObject } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import StudentMyCoursesPage from "../pages/student/StudentMyCoursesPage";
import CourseLearningPage from "../pages/student/CourseLearningPage";
import ProtectedRoute from "./ProtectedRoute";

/**
 * Student Routes
 * Protected routes for authenticated students
 */
const studentRoutes: RouteObject[] = [
  // Course Learning Page - uses its own layout (no student sidebar)
  {
    path: "/student/courses/:courseId",
    element: (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <CourseLearningPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/courses/:courseId/lessons/:lessonId",
    element: (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <CourseLearningPage />
      </ProtectedRoute>
    ),
  },
  // Main student routes with sidebar
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <StudentDashboardPage />,
      },
      {
        path: "profile",
        element: <StudentProfilePage />,
      },
      {
        path: "my-courses",
        element: <StudentMyCoursesPage />,
      },
      {
        path: "schedule",
        element: <div>Schedule Page - Coming Soon</div>,
      },
      {
        path: "messages",
        element: <div>Messages Page - Coming Soon</div>,
      },
      {
        path: "certificates",
        element: <div>Certificates Page - Coming Soon</div>,
      },
      {
        path: "settings",
        element: <div>Settings Page - Coming Soon</div>,
      },
    ],
  },
];

export default studentRoutes;
