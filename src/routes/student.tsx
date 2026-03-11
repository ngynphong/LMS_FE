import React from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import StudentLayout from "@/layouts/StudentLayout";
const StudentDashboardPage = React.lazy(
  () => import("@/pages/student/StudentDashboardPage"),
);
const StudentMyCoursesPage = React.lazy(
  () => import("@/pages/student/StudentMyCoursesPage"),
);
const StudentCourseLearningPage = React.lazy(
  () => import("@/pages/student/CourseLearningPage"),
);
const StudentProfilePage = React.lazy(
  () => import("@/pages/student/StudentProfilePage"),
);
const StudentAvailableQuizzesPage = React.lazy(
  () => import("@/pages/student/StudentAvailableQuizzesPage"),
);
const StudentQuizTakingPage = React.lazy(
  () => import("@/pages/student/StudentQuizTakingPage"),
);
const StudentNotificationPage = React.lazy(
  () => import("@/pages/student/StudentNotificationPage"),
);
const QuizAttemptResultPage = React.lazy(
  () => import("@/pages/student/QuizAttemptResultPage"),
);

// Live Quiz
const LiveQuizJoinPage = React.lazy(
  () => import("@/pages/student/live-quiz/LiveQuizJoinPage"),
);
const LiveQuizLobbyPage = React.lazy(
  () => import("@/pages/student/live-quiz/LiveQuizLobbyPage"),
);
const LiveQuizPlayPage = React.lazy(
  () => import("@/pages/student/live-quiz/LiveQuizPlayPage"),
);
const LiveQuizResultPage = React.lazy(
  () => import("@/pages/student/live-quiz/LiveQuizResultPage"),
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
    path: "/student/live-quiz/join",
    element: <LiveQuizJoinPage />,
  },
  {
    path: "/student/live-quiz/lobby/:pin",
    element: <LiveQuizLobbyPage />,
  },
  {
    path: "/student/live-quiz/play/:pin",
    element: <LiveQuizPlayPage />,
  },
  {
    path: "/student/live-quiz/result/:pin",
    element: <LiveQuizResultPage />,
  },
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
      {
        path: "notifications",
        element: <StudentNotificationPage />,
      },
      {
        path: "quiz/attempts/:id",
        element: <QuizAttemptResultPage />,
      },
    ],
  },
];

export default studentRoutes;
