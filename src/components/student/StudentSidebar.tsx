import { Link, useLocation } from "react-router-dom";
import {
  FaCertificate,
  FaCalendar,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard, MdLibraryBooks, MdQuiz } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useState, useEffect } from "react";

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
    path: "/student/quizzes",
    icon: <MdQuiz className="text-xl" />,
    label: "Bài kiểm tra",
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
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const StudentSidebar = ({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: StudentSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 transform
              ${isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
              ${isCollapsed ? "lg:w-20" : "lg:w-64"}
              overflow-visible
          `}
      >
        {/* Toggle Button - Placed outside the scrolling container so it's not clipped */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:color-primary shadow-sm z-50 text-xs hidden lg:flex items-center justify-center transition-colors"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        {/* Inner Container for Content with Scroll */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="absolute right-4 top-4 lg:hidden text-gray-500 hover:text-red-500 transition-colors z-50"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Logo */}
          <div className={`p-4 ${isCollapsed ? "lg:px-2" : ""}`}>
            <Link
              to="/"
              className={`flex items-center gap-3 ${isCollapsed ? "lg:justify-center" : ""}`}
            >
              <div className="size-10 rounded-lg flex items-center justify-center text-white shrink-0">
                <img
                  src="/ies-edu-logo.png"
                  alt="ies-edu-logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <span className="text-xl font-bold tracking-tight color-primary whitespace-nowrap overflow-hidden lg:block hidden">
                  IES Edu
                </span>
              )}
              <span className="text-xl font-bold tracking-tight color-primary whitespace-nowrap overflow-hidden lg:hidden">
                IES Edu
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-2 overflow-y-auto custom-scrollbar">
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center text-sm gap-3 transition-all rounded-lg ${
                      isCollapsed ? "lg:justify-center lg:p-3" : "px-4 py-3"
                    } ${
                      isActive(item.path)
                        ? "bg-blue-50 color-primary font-semibold shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <span
                      className={`shrink-0 ${isActive(item.path) ? "color-primary" : "text-slate-400 group-hover:text-slate-600"}`}
                    >
                      {item.icon}
                    </span>
                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate lg:block hidden">
                        {item.label}
                      </span>
                    )}
                    <span className="truncate lg:hidden">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section: User Profile & Logout */}
          <div className="p-4 border-t border-gray-100 bg-white">
            {/* User Profile Card */}
            {user && (
              <Link
                to="/student/profile"
                className={`block mb-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  isCollapsed ? "lg:p-1 lg:flex lg:justify-center" : "p-3"
                }`}
                title={isCollapsed ? `${user.firstName} ${user.lastName}` : ""}
              >
                <div
                  className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
                >
                  <img
                    src={
                      user.urlImg ||
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="size-9 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <div className="overflow-hidden lg:block hidden min-w-0">
                      <span className="font-semibold text-sm text-gray-900 truncate block">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-gray-500 truncate block">
                        {user.email}
                      </span>
                    </div>
                  )}
                  <div className="overflow-hidden lg:hidden min-w-0">
                    <span className="font-semibold text-sm text-gray-900 truncate block">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-500 truncate block">
                      {user.email}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`flex items-center justify-center text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all rounded-lg ${
                isCollapsed ? "lg:size-10 lg:p-0" : "gap-2 px-3 py-2.5 w-full"
              }`}
              title={isCollapsed ? "Đăng xuất" : ""}
            >
              <FaSignOutAlt className="text-lg" />
              {(!isCollapsed || isMobileOpen) && (
                <span className="font-medium lg:block hidden">Đăng xuất</span>
              )}
              <span className="font-medium lg:hidden">Đăng xuất</span>
            </button>
          </div>
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
    </>
  );
};

export default StudentSidebar;
