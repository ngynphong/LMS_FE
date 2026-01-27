import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPayments,
  MdAnalytics,
  MdSettings,
} from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import {
  FaCalendar,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
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
}

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const { logout } = useAuth();
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
      className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 text-gray-500 hover:text-[#0077BE] shadow-sm z-50 text-xs"
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className={`p-6 ${isCollapsed ? "px-2" : ""}`}>
        <div
          className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="bg-[#0078bd] size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#0078bd]/20 shrink-0">
            <IoSchool className="text-xl" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-[#101518] text-base font-bold leading-none truncate">
                Edu-LMS Admin
              </h1>
              <p className="text-[#5e7c8d] text-xs mt-1 truncate">
                Hệ thống quản trị
              </p>
            </div>
          )}
        </div>
      </div>

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

      <div
        className={`p-4 border-t border-slate-200 ${isCollapsed ? "px-2" : ""}`}
      >
        <div
          className={`flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 ${isCollapsed ? "justify-center p-2" : ""}`}
        >
          <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm shrink-0">
            <img
              alt="Admin avatar"
              className="size-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgKX6_8otibc07LVbnXidaWhIYKUEyDYgkOlggPD35p401FeIiH3yGVmfqH_5RUnwTSgj-jHn3Sw_htlHd7lSVJqTNasIy4GOAg7vnbOTJlM5AGnFBKAJq8qRL5QyWInBrFw4d0Y2cdqeaeD1aPvwtjS6E_qxtOCouosG1CYfTM_EFYSgid-GauAQVjvIW5CstCpehyzqrVnS-CUo18oX-SuQuZrzDhOia6PHgrWhEiuDDoIn1JIToA_-3anoBf5nJxujzuZJ4Ttpf"
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-bold text-[#101518] truncate">
                Admin User
              </p>
              <p className="text-[10px] text-[#5e7c8d] truncate">
                admin@edulms.com
              </p>
            </div>
          )}
        </div>
      </div>
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

export default AdminSidebar;
