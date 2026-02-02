import type { RouteObject } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import StudentMyCoursesPage from "../pages/student/StudentMyCoursesPage";
import StudentCourseLearningPage from "../pages/student/CourseLearningPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import StudentAvailableQuizzesPage from "../pages/student/StudentAvailableQuizzesPage";
import StudentQuizTakingPage from "../pages/student/StudentQuizTakingPage";

const studentRoutes: RouteObject[] = [
  {
    path: "/student/quizzes/:quizId/take",
    element: <StudentQuizTakingPage />,
  },
  {
    path: "/student/courses/:courseId/learn",
    element: <StudentCourseLearningPage />,
  },
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboardPage />,
      },
      {
        path: "my-courses",
        element: <StudentMyCoursesPage />,
      },
      {
        path: "profile",
        element: <StudentProfilePage />,
      },
      {
        path: "quizzes",
        element: <StudentAvailableQuizzesPage />,
      },
    ],
  },
];

export default studentRoutes;
