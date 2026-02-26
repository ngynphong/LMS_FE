import React from "react";
import { CiViewList } from "react-icons/ci";
import { FaBookOpen } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Biểu tượng (SVG) mang phong cách giáo dục */}
        <div className="flex justify-center mb-8 animate-bounce">
          <svg
            className="w-40 h-40 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
            {/* Kính lúp tìm kiếm */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35"
            />
            <circle cx="14.5" cy="14.5" r="2.5" />
          </svg>
        </div>

        {/* Tiêu đề 404 */}
        <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400 mb-4 drop-shadow-sm">
          404
        </h1>

        {/* Thông báo chính */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          Oops! Bạn có vẻ đã đi lạc...
        </h2>

        {/* Thông báo phụ phù hợp với ngữ cảnh Edu */}
        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
          Trang tài liệu, khóa học hoặc bài tập bạn đang tìm kiếm không tồn tại
          hoặc đã được di chuyển. Đừng lo, hãy tiếp tục hành trình học tập của
          bạn nào!
        </p>

        {/* Các nút điều hướng */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Về Trang Chủ
          </a>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-blue-200 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
          >
            Quay lại trang trước
          </button>
        </div>

        {/* Liên kết nhanh (Quick links) */}
        <div className="mt-12 pt-8 border-t border-blue-100">
          <p className="text-sm font-medium text-slate-500 mb-4">
            Liên kết hữu ích cho bạn:
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="/courses"
              className="flex items-center gap-2 justify-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <CiViewList /> Danh sách Khóa học
            </a>
            <a
              href="/library"
              className="flex items-center gap-2 justify-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <FaBookOpen /> Thư viện Tài liệu
            </a>
            <a
              href="/support"
              className="flex items-center gap-2 justify-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              <FaHeadphones /> Hỗ trợ Học viên
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
