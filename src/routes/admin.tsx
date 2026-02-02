import React from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AdminLayout = React.lazy(() => import("../layouts/AdminLayout"));
const AdminDashboardPage = React.lazy(
  () => import("../pages/admin/AdminDashboardPage"),
);
const AdminUserManagementPage = React.lazy(
  () => import("../pages/admin/AdminUserManagementPage"),
);
const AdminCourseListPage = React.lazy(
  () => import("../pages/admin/AdminCourseListPage"),
);
const AdminCourseDetailPage = React.lazy(
  () => import("../pages/admin/AdminCourseDetailPage"),
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
        path: "courses/:id",
        element: <AdminCourseDetailPage />,
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
        element: (
          <div className="p-8 text-[#101518]">
            Trang Cấu hình hệ thống - Coming Soon
          </div>
        ),
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
