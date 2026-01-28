import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const StudentPasswordChangeForm = () => {
  const { changePassword, token, logout } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        token: token,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      logout();
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-gray-900 text-sm font-semibold">
          Mật khẩu hiện tại
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-lg border border-gray-300 h-12 px-4 text-sm transition-all focus:border-[#27A4F2] outline-none focus:ring-2 focus:ring-[#27A4F2]"
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            required
            placeholder="Nhập mật khẩu hiện tại"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => toggleVisibility("current")}
          >
            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-900 text-sm font-semibold">
          Mật khẩu mới
        </label>
        <div className="relative">
          <input
            className="form-input w-full rounded-lg border border-gray-300 h-12 px-4 text-sm transition-all focus:border-[#27A4F2] outline-none focus:ring-2 focus:ring-[#27A4F2]"
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
            placeholder="Nhập mật khẩu mới"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => toggleVisibility("new")}
          >
            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-900 text-sm font-semibold">
          Xác nhận mật khẩu mới
        </label>
        <div className="relative">
          <input
            className=" form-input w-full rounded-lg border border-gray-300 h-12 px-4 text-sm transition-all focus:border-[#27A4F2] outline-none focus:ring-2 focus:ring-[#27A4F2]"
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Nhập lại mật khẩu mới"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => toggleVisibility("confirm")}
          >
            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          className="flex items-center justify-center min-w-[140px] px-6 py-3 rounded-lg color-primary-bg text-white font-semibold hover:bg-[#0066a3] transition-all shadow-md shadow-[#0077BE]/20 disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </div>
    </form>
  );
};
