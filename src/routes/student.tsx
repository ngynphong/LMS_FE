import React from "react";
import type { RouteObject } from "react-router-dom";

const StudentLayout = React.lazy(() => import("../layouts/StudentLayout"));
const StudentDashboardPage = React.lazy(
  () => import("../pages/student/StudentDashboardPage"),
);
const StudentMyCoursesPage = React.lazy(
  () => import("../pages/student/StudentMyCoursesPage"),
);
const StudentCourseLearningPage = React.lazy(
  () => import("../pages/student/CourseLearningPage"),
);
const StudentProfilePage = React.lazy(
  () => import("../pages/student/StudentProfilePage"),
);
const StudentAvailableQuizzesPage = React.lazy(
  () => import("../pages/student/StudentAvailableQuizzesPage"),
);
const StudentQuizTakingPage = React.lazy(
  () => import("../pages/student/StudentQuizTakingPage"),
);

const studentRoutes: RouteObject[] = [
  {
    path: "/student/quizzes/:quizId/take",
    element: <StudentQuizTakingPage />,
  },
  {
    path: "/student/courses/:courseId/lessons/:lessonId",
    element: <StudentCourseLearningPage />,
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
