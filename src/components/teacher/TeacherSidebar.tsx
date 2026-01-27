import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  MdDashboard,
  MdLibraryBooks,
  MdQuiz,
  MdReport,
  MdSettings,
} from "react-icons/md";
import { FaDatabase } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useState } from "react";

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    path: "/teacher/dashboard",
    icon: <MdDashboard className="text-xl" />,
    label: "Tổng quan",
  },
  {
    path: "/teacher/courses",
    icon: <MdLibraryBooks className="text-xl" />,
    label: "Khóa học",
  },
  {
    path: "/teacher/questions",
    icon: <FaDatabase className="text-xl" />,
    label: "Ngân hàng câu hỏi",
  },
  {
    path: "/teacher/exams",
    icon: <MdQuiz className="text-xl" />,
    label: "Đề thi",
  },
  {
    path: "/teacher/students",
    icon: <IoPeople className="text-xl" />,
    label: "Học viên",
  },
  {
    path: "/teacher/reports",
    icon: <MdReport className="text-xl" />,
    label: "Báo cáo",
  },
  {
    path: "/teacher/settings",
    icon: <MdSettings className="text-xl" />,
    label: "Cài đặt",
  },
];

interface TeacherSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const TeacherSidebar = ({ isCollapsed, onToggle }: TeacherSidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white border-r border-[#dbe2e6] flex flex-col justify-between py-6 z-50 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col gap-8 relative">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1 bg-white border border-[#dbe2e6] rounded-full p-1 text-gray-500 hover:text-[#0077BE] shadow-sm z-50 text-xs"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {/* Profile Section */}
        <div
          className={`px-6 flex items-center gap-3 ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#0b8eda]/20 shrink-0"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxzHGBuvCbcbT7_cVmyqt_jJ7NCJw2mxPGD66bp0OtXUigvQ8TGNcmtIZ5DZtmQaCXqeSV3YtcXZnQJrjarq2RE70oBSFDMaehH6RJw-5HZMewr30nWv8Dnu8AEITbjgPtPSa129dlh7aDtMW6nkazmBKzyHiKYSEQscd5sUh4NhVAgJSkwvETf9GuI1R-0pv8qqI0dR53X2sxOIQ6h_3Itp75g0oZP4sqs63EejNd-_fsFOZxYcevr0iU2NP9F5s42xDxXBtpTKQx")`,
            }}
          />
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <h1 className="text-[#111518] text-base font-bold leading-tight truncate">
                Edu-LMS
              </h1>
              <p className="text-[#607b8a] text-xs font-medium truncate">
                Giảng viên
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center text-sm gap-3 transition-all ${
                    isCollapsed ? "justify-center px-2 py-3.5" : "px-6 py-3.5"
                  } ${
                    isActive(item.path)
                      ? "text-[#0077BE] bg-[#0077BE]/5 border-r-4 border-[#0077BE] font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#0077BE]"
                  } ${isCollapsed && isActive(item.path) ? "border-r-0 rounded-lg" : ""}`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`px-6 flex flex-col gap-4 ${isCollapsed ? "px-2 items-center" : ""}`}
      >
        {/* Create Course Button - Icon only when collapsed */}
        <button
          className={`bg-[#0b8eda] hover:bg-[#0b8eda]/90 text-white text-sm font-bold rounded-md flex items-center justify-center transition-all ${
            isCollapsed ? "size-10 p-0 rounded-full" : "w-full py-3 gap-2"
          }`}
          title={isCollapsed ? "Tạo khóa học mới" : ""}
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          {!isCollapsed && <span>Tạo khóa học mới</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className={`flex items-center text-sm text-red-500 hover:bg-red-50 transition-all rounded-md ${
            isCollapsed
              ? "justify-center size-10 p-0"
              : "gap-3 px-3 py-2.5 w-full"
          }`}
          title={isCollapsed ? "Đăng xuất" : ""}
        >
          <FaSignOutAlt className="text-xl" />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        confirmLabel="Đăng xuất"
        cancelLabel="Hủy"
        variant="danger"
      />
    </aside>
  );
};

export default TeacherSidebar;
