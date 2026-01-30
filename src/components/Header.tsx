import { Link } from "react-router-dom";
import { IoAppsOutline, IoSchool, IoMenu, IoClose } from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { PhoneCall } from "./animate-ui/icons/phone-call";
import { Mail } from "./animate-ui/icons/mail";

const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="w-full color-primary-bg text-white py-2 px-4 md:px-10 z-50 text-xs flex justify-end md:justify-between items-center fixed transition-all duration-300">
        <div className="hidden md:flex gap-6 items-center">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              <PhoneCall animateOnHover size={18} />
            </span>{" "}
            (+84) 096 524 8115
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
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 px-2 rounded-lg transition-colors group"
              >
                <img
                  src={
                    user.urlImg ||
                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-6 h-6 rounded-full object-cover border border-white/50"
                />
                <span className="font-medium text-sm group-hover:underline">
                  {user.firstName} {user.lastName}
                </span>
              </Link>
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
      <header className="w-full px-4 md:px-10 mb-8 md:mb-12 mt-2 sticky top-14 z-40">
        <div className="max-w-[1280px] mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-12">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden color-primary text-2xl"
              onClick={toggleMobileMenu}
            >
              <IoMenu />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <span className="color-primary text-2xl">
                <img
                  src="/ies-edu-logo.png"
                  alt="ies-edu-logo"
                  className="w-10 h-10 md:w-12 md:h-12"
                />
              </span>
              <h2 className="text-lg md:text-xl color-primary font-bold tracking-tight">
                IES Edu
              </h2>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">
                  <IoAppsOutline />
                </span>{" "}
                Danh mục
              </button>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/"
              >
                Trang chủ
              </Link>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/courses"
              >
                Khóa học
              </Link>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/forum"
              >
                Diễn đàn
              </Link>
              <Link
                className="font-medium hover:color-primary transition-colors"
                to="/about"
              >
                Về chúng tôi
              </Link>
            </nav>
          </div>
          <Link to="/courses" className="hidden lg:flex color-primary-bg text-white px-6 py-2.5 rounded-xl font-bold items-center gap-2 shadow-lg shadow-[#0077BE]/20 hover:cursor-pointer hover:translate-y-[-2px] duration-300 transition-all">
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
                src="/ies-edu-logo.png"
                alt="ies-edu-logo"
                className="w-8 h-8"
              />
              <h2 className="text-lg color-primary font-bold tracking-tight">
                IES Edu
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
              <button className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium text-left w-full">
                <IoAppsOutline className="text-xl" />
                Danh mục
              </button>
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
