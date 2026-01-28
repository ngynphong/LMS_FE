import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPayments,
  MdAnalytics,
  MdSettings,
} from "react-icons/md";
import {
  FaCalendar,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
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
    path: "/admin/dashboard",
    icon: <MdDashboard className="text-xl" />,
    label: "Tổng quan",
  },
  {
    path: "/admin/users",
    icon: <MdLibraryBooks className="text-xl" />,
    label: "Quản lý người dùng",
  },
  {
    path: "/admin/courses",
    icon: <FaCalendar className="text-xl" />,
    label: "Quản lý khóa học",
  },
  {
    path: "/admin/transactions",
    icon: <MdPayments className="text-xl" />,
    label: "Quản lý giao dịch",
  },
  {
    path: "/admin/reports",
    icon: <MdAnalytics className="text-xl" />,
    label: "Quản lý báo cáo",
  },
  {
    path: "/admin/settings",
    icon: <MdSettings className="text-xl" />,
    label: "Cài đặt hệ thống",
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const AdminSidebar = ({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, onMobileClose]);

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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 transform
              ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
              ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          `}
      >
        {/* Container for flex layout */}
        <div className="flex flex-col flex-1 min-h-0">
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
            className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:color-primary shadow-sm z-50 text-xs hidden lg:flex items-center justify-center transition-colors"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>

          <div className={`px-6 pt-8 pb-4 ${isCollapsed ? "lg:px-2" : ""}`}>
            <div
              className={`flex items-center gap-3 ${isCollapsed ? "lg:justify-center" : ""}`}
            >
              <div className="size-10 flex items-center justify-cent shrink-0">
                <img
                  src="/ies-edu-logo.png"
                  alt="ies-edu-logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="whitespace-nowrap overflow-hidden lg:block hidden">
                  <h1 className="text-slate-900 text-base font-bold leading-none truncate">
                    IES Admin
                  </h1>
                  <p className="text-slate-500 text-xs mt-1.5 truncate font-medium">
                    Hệ thống quản trị
                  </p>
                </div>
              )}
              <div className="flex flex-col overflow-hidden lg:hidden">
                <h1 className="text-slate-900 text-base font-bold leading-none truncate">
                  IES Admin
                </h1>
                <p className="text-slate-500 text-xs mt-1.5 truncate font-medium">
                  Hệ thống quản trị
                </p>
              </div>
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

          <div
            className={`p-4 border-t border-gray-100 ${isCollapsed ? "lg:px-2" : ""}`}
          >
            <div
              className={`flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 ${isCollapsed ? "lg:justify-center lg:p-2" : ""}`}
            >
              <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm shrink-0">
                <img
                  alt="Admin avatar"
                  className="size-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgKX6_8otibc07LVbnXidaWhIYKUEyDYgkOlggPD35p401FeIiH3yGVmfqH_5RUnwTSgj-jHn3Sw_htlHd7lSVJqTNasIy4GOAg7vnbOTJlM5AGnFBKAJq8qRL5QyWInBrFw4d0Y2cdqeaeD1aPvwtjS6E_qxtOCouosG1CYfTM_EFYSgid-GauAQVjvIW5CstCpehyzqrVnS-CUo18oX-SuQuZrzDhOia6PHgrWhEiuDDoIn1JIToA_-3anoBf5nJxujzuZJ4Ttpf"
                />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="whitespace-nowrap overflow-hidden lg:block hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Admin User
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    admin@ies.edu.vn
                  </p>
                </div>
              )}
              <div className="flex flex-col overflow-hidden lg:hidden">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Admin User
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  admin@ies.edu.vn
                </p>
              </div>
            </div>
          </div>
          {/* Bottom Section */}
          <div className={`p-4 pt-0 space-y-2 ${isCollapsed ? "lg:px-2" : ""}`}>
            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`flex items-center text-sm text-red-500 hover:bg-red-50 transition-all rounded-md ${
                isCollapsed
                  ? "lg:justify-center lg:w-full lg:py-3"
                  : "gap-3 px-6 py-3.5 w-full"
              } gap-3 px-6 py-3.5 w-full`}
              title={isCollapsed ? "Đăng xuất" : ""}
            >
              <FaSignOutAlt className="text-xl" />
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

export default AdminSidebar;
