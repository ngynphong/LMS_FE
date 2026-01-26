import type { RouteObject } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";
import ProtectedRoute from "./ProtectedRoute";

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
        element: (
          <div className="p-8 text-[#101518]">
            Trang Quản lý khóa học - Coming Soon
          </div>
        ),
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
