import { Link, useLocation } from "react-router-dom";
import {
  FaCertificate,
  FaCalendar,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdDashboard, MdLibraryBooks } from "react-icons/md";
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
    path: "/student/dashboard",
    icon: <MdDashboard className="text-xl" />,
    label: "Tổng quan",
  },
  {
    path: "/student/my-courses",
    icon: <MdLibraryBooks className="text-xl" />,
    label: "Khóa học của tôi",
  },
  {
    path: "/student/schedule",
    icon: <FaCalendar className="text-xl" />,
    label: "Lịch học",
  },
  {
    path: "/student/messages",
    icon: <FaEnvelope className="text-xl" />,
    label: "Tin nhắn",
  },
  {
    path: "/student/certificates",
    icon: <FaCertificate className="text-xl" />,
    label: "Chứng chỉ",
  },
  {
    path: "/student/settings",
    icon: <FaCog className="text-xl" />,
    label: "Cài đặt",
  },
];

interface StudentSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const StudentSidebar = ({ isCollapsed, onToggle }: StudentSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-[#0077BE] shadow-sm z-50 text-xs"
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Logo */}
      <Link
        to="/"
        className={`p-4 flex items-center gap-3 ${isCollapsed ? "justify-center px-2" : ""}`}
      >
        <div className="size-10 rounded-lg flex items-center justify-center text-white shrink-0">
          <img
            src="/ies-edu-logo.png"
            alt="ies-edu-logo"
            className="w-10 h-10"
          />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-black tracking-tight text-gray-900 whitespace-nowrap overflow-hidden">
            IES Edu
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
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
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* User Profile Card */}
      {user && (
        <Link
          to="/student/profile"
          className={`block p-4 mx-2 rounded-xl hover:bg-gray-100 transition-colors ${isCollapsed ? "p-2 flex justify-center" : ""}`}
          title={isCollapsed ? `${user.firstName} ${user.lastName}` : ""}
        >
          <div className="flex items-center gap-3">
            <img
              src={
                user.urlImg ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
              }
              alt={`${user.firstName} ${user.lastName}`}
              className="size-8 rounded-full object-cover border border-white/50 shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-medium text-sm group-hover:underline truncate block">
                  {user.firstName} {user.lastName}
                </span>
                <div className="flex items-center">
                  <span className="text-[10px] text-gray-500 group-hover:underline truncate block">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Link>
      )}
      {/* Bottom Section */}
      <div
        className={`p-4 border-t border-gray-100 space-y-2 ${isCollapsed ? "px-2" : ""}`}
      >
        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className={`flex items-center text-sm text-red-500 hover:bg-red-50 transition-all rounded-md ${
            isCollapsed
              ? "justify-center w-full py-3"
              : "gap-3 px-6 py-3.5 w-full"
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

export default StudentSidebar;
