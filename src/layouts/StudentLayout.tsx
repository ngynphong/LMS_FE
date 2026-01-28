import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import StudentSidebar from "../components/student/StudentSidebar";

interface StudentLayoutProps {
  children?: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleSidebarToggle = () => setIsSidebarCollapsed((prev) => !prev);
  const handleMobileSidebarClose = () => setIsMobileSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center px-4 z-40 justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
          <span className="font-bold text-lg text-[#111518]">IES Edu</span>
        </div>
        {user && (
          <img
            src={
              user.urlImg ||
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="size-8 rounded-full object-cover border border-gray-200"
          />
        )}
      </div>

      {/* Sidebar */}
      <StudentSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 pt-16 lg:pt-0 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <main className="flex-1 p-4 md:p-6 lg:p-10 max-w-[1440px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
