import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f5f7f8]">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">{children || <Outlet />}</main>
    </div>
  );
};

export default AdminLayout;
