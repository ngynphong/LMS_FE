import React from "react";
import type { RouteObject } from "react-router-dom";

const MainLayout = React.lazy(() => import("../layouts/MainLayout"));
const Home = React.lazy(() => import("../pages/home/Home"));
const CoursesPage = React.lazy(() => import("../pages/courses/CoursesPage"));
const CourseDetailPage = React.lazy(
  () => import("../pages/courses/CourseDetailPage"),
);
const AboutPage = React.lazy(() => import("../pages/about/AboutPage"));
const UnauthorizedPage = React.lazy(
  () => import("../pages/error/UnauthorizedPage"),
);

/**
 * Public Routes
 * These routes use MainLayout (with header/footer)
 */
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "courses/:id",
        element: <CourseDetailPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "forum",
        element: <div>Forum Page - Coming Soon</div>,
      },
      {
        path: "shop",
        element: <div>Shop Page - Coming Soon</div>,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
];

export default publicRoutes;
