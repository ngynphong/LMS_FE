import { Link } from "react-router-dom";
import { IoAppsOutline, IoSchool, IoMenu, IoClose } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { PhoneCall } from "@/components/animate-ui/icons/phone-call";
import { Mail } from "@/components/animate-ui/icons/mail";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";

const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const categories = [
    { title: "Điều khoản dịch vụ", to: "/terms", icon: "description" },
    { title: "Chính sách bảo mật", to: "/privacy", icon: "shield" },
    { title: "Câu hỏi thường gặp", to: "/faq", icon: "help" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "TEACHER":
        return "/teacher/dashboard";
      case "STUDENT":
        return "/student/dashboard";
      default:
        return "/";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Top Bar */}
      <div
        style={{ top: "var(--banner-height, 0px)" }}
        className="w-full color-primary-bg text-white py-2 px-4 md:px-10 z-60 text-xs flex justify-end md:justify-between items-center fixed transition-all duration-300"
      >
        <div className="hidden md:flex gap-6 items-center">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              <PhoneCall animateOnHover size={18} />
            </span>{" "}
            (+84) 96 524 8115
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              <Mail animateOnHover animation="shake" size={18} />
            </span>{" "}
            infovienies@gmail.com
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex gap-3">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 px-2 rounded-lg transition-colors group"
                >
                  <img
                    src={user.urlImg || "/img/student-default.jpg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-6 h-6 rounded-full object-cover border border-white/50"
                  />
                  <span className="font-medium text-sm group-hover:underline">
                    {user.lastName} {user.firstName}
                  </span>
                </Link>
                <div className="flex items-center -mr-2 text-white">
                  <NotificationDropdown />
                </div>
              </>
            ) : (
              <>
                <Link className="hover:underline" to="/login">
                  Đăng nhập
                </Link>
                <Link className="hover:underline" to="/register">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        style={{ top: "calc(var(--banner-height, 0px) + 3.5rem)" }}
        className="w-full px-4 md:px-10 mb-8 md:mb-12 mt-2 sticky z-40"
      >
        <div className="max-w-[1280px] mx-auto bg-white  rounded-2xl shadow-lg border border-white/40 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-12">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden color-primary text-2xl"
              onClick={toggleMobileMenu}
            >
              <IoMenu />
            </button>

            <Link
              to="/"
              className="flex items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span className="color-primary text-2xl">
                <img
                  src="/img/logo-app.png"
                  alt="ies-edu-logo"
                  className="h-12 md:w-30 md:h-16"
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium ${
                    isCategoryOpen
                      ? "bg-gray-100 color-primary"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="material-symbols-outlined transition-transform duration-300">
                    <IoAppsOutline
                      className={isCategoryOpen ? "rotate-180" : ""}
                    />
                  </span>{" "}
                  Danh mục
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute top-full left-0 w-64 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 transition-all duration-300 origin-top-left z-50 before:content-[''] before:absolute before:top-[-12px] before:left-0 before:w-full before:h-[12px] ${
                    isCategoryOpen
                      ? "opacity-100 scale-100 translate-y-2"
                      : "opacity-0 scale-95 translate-y-0 pointer-events-none"
                  }`}
                >
                  {categories.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.to}
                      onClick={() => {
                        setIsCategoryOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">
                          {item.icon}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Trang chủ
              </Link>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/courses"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Khóa học
              </Link>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/#news"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Tin tức
              </Link>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/about"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Về chúng tôi
              </Link>
            </nav>
          </div>
          <Link
            to="/courses"
            className="hidden lg:flex color-primary-bg text-white px-6 py-2.5 rounded-xl font-bold items-center gap-2 shadow-lg shadow-[#0077BE]/20 hover:cursor-pointer hover:translate-y-[-2px] duration-300 transition-all"
          >
            <span className="material-symbols-outlined">
              <IoSchool />
            </span>{" "}
            Bắt đầu học
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-xl transition-transform duration-300 flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-300">
            <div className="flex items-center gap-2">
              <img
                src="/img/logo-edu.png"
                alt="ies-edu-logo"
                className="w-8 h-8"
              />
              <h2 className="text-lg color-primary font-bold tracking-tight">
                IES EDU
              </h2>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-900 text-2xl"
            >
              <IoClose />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col space-y-1 px-3">
              <button
                onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium text-left w-full"
              >
                <div className="flex items-center gap-3">
                  <IoAppsOutline className="text-xl" />
                  Danh mục
                </div>
                <span
                  className={`material-symbols-outlined transition-transform duration-300 ${isMobileCategoryOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
              {isMobileCategoryOpen && (
                <div className="pl-9 pr-3 pb-2 space-y-1">
                  {categories.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.to}
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                to="/"
                onClick={toggleMobileMenu}
              >
                Trang chủ
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                to="/courses"
                onClick={toggleMobileMenu}
              >
                Khóa học
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                to="/forum"
                onClick={toggleMobileMenu}
              >
                Diễn đàn
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                to="/about"
                onClick={toggleMobileMenu}
              >
                Về chúng tôi
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-300">
            <button className="w-full color-primary-bg text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0077BE]/20 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">
                <IoSchool />
              </span>{" "}
              Bắt đầu học
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
