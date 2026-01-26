import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaCreditCard,
  FaCertificate,
  FaBook,
  FaCheckCircle,
  FaLaptop,
} from "react-icons/fa";
import { AvatarUpload } from "../../components/common/AvatarUpload";

const StudentProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "info" | "password" | "payment" | "certificates"
  >("info");
  const [focusedField, setFocusedField] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    schoolName: "",
    goal: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone:
          user.studentProfile?.emergencyContact ||
          user.studentProfile?.parentPhone ||
          "",
        schoolName: user.studentProfile?.schoolName || "",
        goal: user.studentProfile?.goal || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to update profile
    console.log("Profile updated:", formData);
  };

  // Helper function for input styles
  const getInputStyle = (fieldName: string) => ({
    borderColor: focusedField === fieldName ? "#0077BE" : "#d1d5db",
    boxShadow:
      focusedField === fieldName ? "0 0 0 3px rgba(0, 119, 190, 0.1)" : "none",
    outline: "none",
  });

  const recentActivities = [
    {
      id: 1,
      icon: <FaBook />,
      iconBg: "bg-[#0077BE]/10",
      iconColor: "text-[#0077BE]",
      title: "Đã tham gia khóa học Lập trình Web nâng cao",
      time: "2 giờ trước • Bài giảng #1",
    },
    {
      id: 2,
      icon: <FaCheckCircle />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Hoàn thành bài kiểm tra CSS Grid & Flexbox",
      time: "Hôm qua • Đạt điểm 95/100",
    },
    {
      id: 3,
      icon: <FaLaptop />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Đăng nhập mới từ thiết bị Chrome trên Windows",
      time: "2 ngày trước • Hà Nội, Việt Nam",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="relative group cursor-pointer flex justify-center">
            <AvatarUpload
              currentImageUrl={user?.imgUrl}
              onUploadSuccess={() => {
                // Force refresh or update context if needed (handled by api/context likely)
                window.location.reload(); // Simple refresh to see new avatar everywhere
              }}
              size={112} // 28 * 4 = 112px
              altText={user ? `${user.firstName} ${user.lastName}` : "User"}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 text-lg font-bold">
              {user ? `${user.firstName} ${user.lastName}` : "Người dùng"}
            </h1>
            <p className="text-gray-600 text-sm">
              {user?.role === "STUDENT" ? "Học viên" : "Người dùng"}
            </p>
          </div>
          {/* <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#0077BE] text-white text-sm font-bold hover:bg-[#0066a3] transition-colors">
            <FaUpload className="text-sm" />
            <span>Tải ảnh lên</span>
          </button> */}
        </div>

        {/* Profile Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "info"
                  ? "bg-[#0077BE]/10 text-[#0077BE] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaUser />
              <span className="text-sm">Thông tin cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "password"
                  ? "bg-[#0077BE]/10 text-[#0077BE] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaLock />
              <span className="text-sm">Đổi mật khẩu</span>
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "payment"
                  ? "bg-[#0077BE]/10 text-[#0077BE] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaCreditCard />
              <span className="text-sm">Lịch sử thanh toán</span>
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "certificates"
                  ? "bg-[#0077BE]/10 text-[#0077BE] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaCertificate />
              <span className="text-sm">Chứng chỉ của tôi</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Profile Form */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-gray-900 text-3xl font-black tracking-tight mb-2">
              Hồ sơ của tôi
            </h2>
            <p className="text-gray-600 text-base">
              Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.
            </p>
          </div>

          {activeTab === "info" && (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-sm font-semibold">
                    Họ
                  </label>
                  <input
                    className="w-full rounded-lg border h-12 px-4 text-sm transition-all"
                    style={getInputStyle("firstName")}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-sm font-semibold">
                    Tên
                  </label>
                  <input
                    className="w-full rounded-lg border h-12 px-4 text-sm transition-all"
                    style={getInputStyle("lastName")}
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-sm font-semibold">
                    Email
                  </label>
                  <input
                    className="w-full rounded-lg border h-12 px-4 text-sm transition-all bg-gray-50"
                    style={getInputStyle("email")}
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    // onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-sm font-semibold">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full rounded-lg border h-12 px-4 text-sm transition-all"
                    style={getInputStyle("phone")}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-900 text-sm font-semibold">
                    Trường học / Nơi làm việc
                  </label>
                  <input
                    className="w-full rounded-lg border h-12 px-4 text-sm transition-all"
                    style={getInputStyle("schoolName")}
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("schoolName")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-sm font-semibold">
                  Mục tiêu học tập
                </label>
                <textarea
                  className="w-full rounded-lg border px-4 py-3 text-sm resize-none transition-all"
                  style={getInputStyle("goal")}
                  placeholder="Chia sẻ mục tiêu của bạn..."
                  rows={4}
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("goal")}
                  onBlur={() => setFocusedField("")}
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  className="flex items-center justify-center min-w-[140px] px-6 py-3 rounded-lg bg-[#0077BE] text-white font-semibold hover:bg-[#0066a3] transition-all shadow-md shadow-[#0077BE]/20"
                  type="submit"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <div className="py-8 text-center text-gray-500">
              <p>Tính năng đổi mật khẩu đang được phát triển...</p>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="py-8 text-center text-gray-500">
              <p>Lịch sử thanh toán đang được phát triển...</p>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="py-8 text-center text-gray-500">
              <p>Danh sách chứng chỉ đang được phát triển...</p>
            </div>
          )}
        </section>

        {/* Recent Activities */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 text-xl font-bold">
              Hoạt động gần đây
            </h3>
            <Link
              to="/student/dashboard"
              className="text-[#0077BE] text-sm font-medium hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
              >
                <div
                  className={`shrink-0 size-10 rounded-full ${activity.iconBg} flex items-center justify-center ${activity.iconColor}`}
                >
                  {activity.icon}
                </div>
                <div className="grow">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentProfilePage;
