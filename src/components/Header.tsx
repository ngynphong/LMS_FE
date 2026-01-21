import { Link } from 'react-router-dom';
import { IoSchool } from "react-icons/io5";
import { IoAppsOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import { MdExpandMore } from "react-icons/md";

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-[#0077BE] text-white py-2 px-10 text-xs flex justify-between items-center">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]"><IoIosCall/></span> (+84) 965 248 115
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]"><CiMail/></span> info@edubien.vn
          </span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-1 cursor-pointer">
            <img 
              alt="VN" 
              className="w-4 h-3" 
              src='/Flag_of_Vietnam.png'
            />
            <span>Tiếng Việt</span>
            <span className="material-symbols-outlined text-[14px]"><MdExpandMore/></span>
          </div>
          <div className="flex gap-3">
            <Link className="hover:underline" to="/login">Đăng nhập</Link>
            <Link className="hover:underline" to="/register">Đăng ký</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full px-10 mt-4 sticky top-4 z-50">
        <div className="max-w-[1280px] mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
                <span className='text-[#0077BE] text-2xl'><IoSchool/></span>
              <h2 className="text-xl text-[#0077BE] font-bold tracking-tight">Edu LMS</h2>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined"><IoAppsOutline/></span> Danh mục
              </button>
              <Link className="font-medium hover:text-[#0077BE] transition-colors" to="/">Trang chủ</Link>
              <Link className="font-medium hover:text-[#0077BE] transition-colors" to="/courses">Khóa học</Link>
              <Link className="font-medium hover:text-[#0077BE] transition-colors" to="/forum">Diễn đàn</Link>
              <Link className="font-medium hover:text-[#0077BE] transition-colors" to="/shop">Cửa hàng</Link>
            </nav>
          </div>
          <button className="bg-[#0077BE] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#0077BE]/20 hover:scale-105 transition-transform">
            <span className="material-symbols-outlined">
<IoSchool/>
                </span> Bắt đầu học
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
