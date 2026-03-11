import React from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";
const AdminDashboardPage = React.lazy(
  () => import("@/pages/admin/AdminDashboardPage"),
);
const AdminUserManagementPage = React.lazy(
  () => import("@/pages/admin/AdminUserManagementPage"),
);
const AdminCourseListPage = React.lazy(
  () => import("@/pages/admin/AdminCourseListPage"),
);
const AdminCourseDetailPage = React.lazy(
  () => import("@/pages/admin/AdminCourseDetailPage"),
);
const CreateTeacherPage = React.lazy(
  () => import("@/pages/admin/CreateTeacherPage"),
);
const AdminSettingsPage = React.lazy(
  () => import("@/pages/admin/AdminSettingsPage"),
);
const AdminPasswordRequestsPage = React.lazy(
  () => import("@/pages/admin/AdminPasswordRequestsPage"),
);
const AdminBlogPage = React.lazy(() =>
  import("@/pages/admin/blog/AdminBlogPage")
);
const BlogFormPage = React.lazy(
  () => import("@/pages/admin/blog/BlogFormPage"),
);

// Banner Admin Pages
const BannerListPage = React.lazy(() =>
  import("@/pages/admin/banners/BannerListPage").then((module) => ({
    default: module.BannerListPage,
  })),
);
const BannerCreatePage = React.lazy(() =>
  import("@/pages/admin/banners/BannerCreatePage").then((module) => ({
    default: module.BannerCreatePage,
  })),
);
const BannerEditPage = React.lazy(() =>
  import("@/pages/admin/banners/BannerEditPage").then((module) => ({
    default: module.BannerEditPage,
  })),
);

/**
 * Admin Routes
 * Protected routes for authenticated admin users
 */
const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        element: <AdminUserManagementPage />,
      },
      {
        path: "courses",
        element: <AdminCourseListPage />,
      },
      {
        path: "teachers/new",
        element: <CreateTeacherPage />,
      },
      {
        path: "courses/:id",
        element: <AdminCourseDetailPage />,
      },
      {
        path: "password-requests",
        element: <AdminPasswordRequestsPage />,
      },
      {
        path: "transactions",
        element: (
          <div className="p-8 text-[#101518]">
            Trang Giao dịch - Coming Soon
          </div>
        ),
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
      {
        path: "banners",
        element: <BannerListPage />,
      },
      {
        path: "banners/create",
        element: <BannerCreatePage />,
      },
      {
        path: "banners/edit/:id",
        element: <BannerEditPage />,
      },
      {
        path: "blogs",
        element: <AdminBlogPage />,
      },
      {
        path: "blogs/create",
        element: <BlogFormPage />,
      },
      {
        path: "blogs/edit/:id",
        element: <BlogFormPage />,
      },
      {
        path: "reports",
        element: (
          <div className="p-8 text-[#101518]">Trang Báo cáo - Coming Soon</div>
        ),
      },
    ],
  },
];

export default adminRoutes;
