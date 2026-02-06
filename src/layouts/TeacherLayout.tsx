import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
// import AIChatbot from "../components/common/AIChatbot";
// import { useAuth } from "../hooks/useAuth";

interface TeacherLayoutProps {
  children?: ReactNode;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // const { user } = useAuth();

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
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#dbe2e6] h-16 flex items-center px-4 z-30 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-gray-600"
          >
            <FaBars className="text-xl" />
          </button>
          <span className="font-bold text-lg text-[#111518]">Edu-LMS</span>
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border border-[#0b8eda]/20"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxzHGBuvCbcbT7_cVmyqt_jJ7NCJw2mxPGD66bp0OtXUigvQ8TGNcmtIZ5DZtmQaCXqeSV3YtcXZnQJrjarq2RE70oBSFDMaehH6RJw-5HZMewr30nWv8Dnu8AEITbjgPtPSa129dlh7aDtMW6nkazmBKzyHiKYSEQscd5sUh4NhVAgJSkwvETf9GuI1R-0pv8qqI0dR53X2sxOIQ6h_3Itp75g0oZP4sqs63EejNd-_fsFOZxYcevr0iU2NP9F5s42xDxXBtpTKQx")`,
          }}
        />
      </div>

      {/* Sidebar */}
      <TeacherSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300 pt-16 lg:pt-0 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* AI Chatbot */}
      {/* <AIChatbot /> */}
    </div>
  );
};

export default TeacherLayout;
