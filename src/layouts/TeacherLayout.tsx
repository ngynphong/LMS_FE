import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

interface TeacherLayoutProps {
  children?: ReactNode;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7f8] flex">
      {/* Sidebar */}
      <TeacherSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
