import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/admin/AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = useCallback(
    () => setIsSidebarCollapsed((prev) => !prev),
    [],
  );
  const handleMobileSidebarClose = useCallback(
    () => setIsMobileSidebarOpen(false),
    [],
  );

  return (
    <div className="min-h-screen bg-[#f5f7f8] flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center px-4 z-30 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-gray-600"
          >
            <FaBars className="text-xl" />
          </button>
          <span className="font-bold text-lg text-[#101518]">
            Edu-LMS Admin
          </span>
        </div>
        <img
          alt="Admin avatar"
          className="size-8 rounded-full object-cover border border-gray-200"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgKX6_8otibc07LVbnXidaWhIYKUEyDYgkOlggPD35p401FeIiH3yGVmfqH_5RUnwTSgj-jHn3Sw_htlHd7lSVJqTNasIy4GOAg7vnbOTJlM5AGnFBKAJq8qRL5QyWInBrFw4d0Y2cdqeaeD1aPvwtjS6E_qxtOCouosG1CYfTM_EFYSgid-GauAQVjvIW5CstCpehyzqrVnS-CUo18oX-SuQuZrzDhOia6PHgrWhEiuDDoIn1JIToA_-3anoBf5nJxujzuZJ4Ttpf"
        />
      </div>

      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen pt-16 lg:pt-0 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <main className="flex-1 p-4 lg:p-8 w-full max-w-[1440px] mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
