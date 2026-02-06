import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
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
import { useState, useEffect } from "react";
import { ChevronLeft } from "../animate-ui/icons/chevron-left";
import { ChevronRight } from "../animate-ui/icons/chevron-right";
import { LogOut } from "../animate-ui/icons/log-out";

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
    path: "/teacher/quizzes",
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
    label: "Báo cáo điểm",
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
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const TeacherSidebar = ({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: TeacherSidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
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
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col gap-6 relative flex-1">
            {/* Mobile Close Button */}
            <button
              onClick={onMobileClose}
              className="absolute right-4 top-4 lg:hidden text-gray-500 hover:text-gray-900 z-50"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Toggle Button */}
            <button
              onClick={onToggle}
              className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:color-primary shadow-sm z-50 text-xs hidden lg:flex items-center justify-center transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight animateOnHover animation="path-loop" size={14} />
              ) : (
                <ChevronLeft animateOnHover animation="path-loop" size={14} />
              )}
            </button>

            {/* Profile Section */}
            <div
              className={`px-6 pt-8 flex items-center gap-3 transition-all duration-300 ${
                isCollapsed ? "lg:justify-center lg:px-2" : ""
              }`}
            >
              <div
                className={`bg-center bg-no-repeat bg-cover rounded-full border border-gray-100 shadow-sm shrink-0 transition-all duration-300 ${
                  isCollapsed ? "size-10" : "size-12"
                }`}
                style={{
                  backgroundImage: `url("/img/avatar-default.png")`,
                }}
              />
              {(!isCollapsed || isMobileOpen) && (
                <div className="whitespace-nowrap overflow-hidden lg:block hidden">
                  <h1 className="text-slate-900 text-base font-bold leading-tight truncate">
                    IES Edu
                  </h1>
                  <p className="text-slate-500 text-xs font-medium truncate mt-0.5">
                    Giảng viên
                  </p>
                </div>
              )}
              <div className="flex flex-col whitespace-nowrap overflow-hidden lg:hidden">
                <h1 className="text-slate-900 text-base font-bold leading-tight truncate">
                  IES Edu
                </h1>
                <p className="text-slate-500 text-xs font-medium truncate mt-0.5">
                  Giảng viên
                </p>
              </div>
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
          </div>

          <div
            className={`p-4 mt-auto border-t border-gray-100 flex flex-col gap-3 bg-white ${
              isCollapsed ? "lg:px-2 lg:items-center" : ""
            }`}
          >
            {/* Create Course Button */}
            <button
              onClick={() => navigate("/teacher/courses/new")}
              className={`color-primary-bg hover:opacity-90 text-white text-sm font-bold rounded-lg flex items-center justify-center transition-all shadow-md shadow-blue-200 ${
                isCollapsed ? "lg:size-10 lg:p-0" : "w-full py-3 gap-2"
              } w-full py-3 gap-2`}
              title={isCollapsed ? "Tạo khóa học mới" : ""}
            >
              <span className="material-symbols-outlined text-xl">
                add_circle
              </span>
              {(!isCollapsed || isMobileOpen) && (
                <span className="lg:block hidden">Tạo khóa học mới</span>
              )}
              <span className="lg:hidden">Tạo khóa học mới</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`flex items-center justify-center text-sm text-red-500 hover:bg-red-50 hover:text-red-600 hover:cursor-pointer transition-all rounded-lg ${
                isCollapsed ? "lg:size-10 lg:p-0" : "gap-2 px-3 py-2.5 w-full"
              }`}
              title={isCollapsed ? "Đăng xuất" : ""}
            >
              <LogOut animateOnHover size={18} />
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

export default TeacherSidebar;
