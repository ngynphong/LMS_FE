import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar";

interface StudentLayoutProps {
  children?: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex">
      {/* Sidebar */}
      <StudentSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <main className="flex-1 p-6 md:p-10 max-w-[1440px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
