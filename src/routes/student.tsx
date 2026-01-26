import type { RouteObject } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import StudentMyCoursesPage from "../pages/student/StudentMyCoursesPage";

/**
 * Student Routes
 * Protected routes for authenticated students
 * TODO: Add ProtectedRoute wrapper with role check
 */
const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <StudentLayout />,
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
