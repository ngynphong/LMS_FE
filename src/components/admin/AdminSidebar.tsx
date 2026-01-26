import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPayments,
  MdAnalytics,
  MdSettings,
} from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { FaCalendar, FaSignOutAlt } from "react-icons/fa";

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
};


  const navItems: NavItem[] = [
    {
      path: "/admin/dashboard",
      icon: <MdDashboard className="text-lg" />,
      label: "Tổng quan",
    },
    {
      path: "/admin/users",
      icon: <MdLibraryBooks className="text-lg" />,
      label: "Quản lý người dùng",
    },
    {
      path: "/admin/courses",
      icon: <FaCalendar className="text-lg" />,
      label: "Quản lý khóa học",
    },
    {
      path: "/admin/transactions",
      icon: <MdPayments className="text-lg" />,
      label: "Quản lý giao dịch",
    },
    {
      path: "/admin/reports",
      icon: <MdAnalytics className="text-lg" />,
      label: "Quản lý báo cáo",
    },
    {
      path: "/admin/settings",
      icon: <MdSettings className="text-lg" />,
      label: "Cài đặt hệ thống",
    },
  ];


const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // TODO: Call logout API
    console.log("Logging out...");
    // Redirect to login
    window.location.href = "/login";
  };

  
  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#0078bd] size-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#0078bd]/20">
            <IoSchool className="text-xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#101518] text-base font-bold leading-none">
              Edu-Lms Admin
            </h1>
            <p className="text-[#5e7c8d] text-xs mt-1">Hệ thống quản trị</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
            <nav className="flex-1 mt-6">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center text-sm gap-3 px-6 py-3.5 transition-all ${
                        isActive(item.path)
                          ? "text-[#0077BE] bg-[#0077BE]/5 border-r-4 border-[#0077BE] rounded-md font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#0077BE]"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="size-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
            <img
              alt="Admin avatar"
              className="size-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgKX6_8otibc07LVbnXidaWhIYKUEyDYgkOlggPD35p401FeIiH3yGVmfqH_5RUnwTSgj-jHn3Sw_htlHd7lSVJqTNasIy4GOAg7vnbOTJlM5AGnFBKAJq8qRL5QyWInBrFw4d0Y2cdqeaeD1aPvwtjS6E_qxtOCouosG1CYfTM_EFYSgid-GauAQVjvIW5CstCpehyzqrVnS-CUo18oX-SuQuZrzDhOia6PHgrWhEiuDDoIn1JIToA_-3anoBf5nJxujzuZJ4Ttpf"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold text-[#101518]">Admin User</p>
            <p className="text-[10px] text-[#5e7c8d]">admin@edulms.com</p>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center text-sm gap-3 px-6 py-3.5 text-red-500 hover:bg-red-50 transition-all w-full rounded-md"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
    </aside>
  );
};

export default AdminSidebar;
