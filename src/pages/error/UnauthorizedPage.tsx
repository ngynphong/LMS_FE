import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
          <FaLock className="text-4xl text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-600 mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản
          trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 color-primary rounded-lg text-white font-medium hover:bg-[#0066a3] transition-colors"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
