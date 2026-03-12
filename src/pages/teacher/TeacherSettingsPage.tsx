import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FaUser, FaLock } from "react-icons/fa";
import { AvatarUpload } from "@/components/common/AvatarUpload";
import { updateProfileApi } from "@/services/authService";
import { useUpdateTeacherProfile } from "@/hooks/useProfile";
import { toast } from "react-toastify";
import { StudentPasswordChangeForm } from "@/pages/student/StudentPasswordChangeForm";
import { MdOutlineVerified } from "react-icons/md";

const TeacherSettingsPage = () => {
  const { user } = useAuth();
  const { mutateAsync: updateTeacherProfile, isPending: updatingProfile } =
    useUpdateTeacherProfile();
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    qualification: "",
    specialization: "",
    experience: "",
    biography: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dob: user.dob || "",
        email: user.email || "",
        qualification: user.teacherProfile?.qualification || "",
        specialization: user.teacherProfile?.specialization || "",
        experience: user.teacherProfile?.experience || "",
        biography: user.teacherProfile?.biography || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên";
    if (!formData.dob) newErrors.dob = "Vui lòng chọn ngày sinh";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Cập nhật thông tin user (firstName, lastName, dob)
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
      };
      await updateProfileApi(updatedUser);

      // Cập nhật teacher profile (qualification, specialization, experience, biography)
      await updateTeacherProfile({
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: formData.experience,
        biography: formData.biography,
      });

      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error("Lỗi cập nhật hồ sơ");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="relative group cursor-pointer flex justify-center">
            <AvatarUpload
              currentImageUrl={user?.urlImg}
              onUploadSuccess={() => {
                window.location.reload();
              }}
              size={112}
              altText={user ? `${user.firstName} ${user.lastName}` : "User"}
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 text-lg font-bold">
              {user ? `${user.firstName} ${user.lastName}` : "Giảng viên"}
            </h1>
            <p className="text-gray-600 text-sm">Giảng viên</p>
            {user?.teacherProfile?.isVerified ? (
              <div className="inline-flex justify-center items-center gap-1 text-sm text-green-600 font-semibold mt-1">
                <span>
                  <MdOutlineVerified />
                </span>
                Đã xác minh
              </div>
            ) : (
              <span className="text-xs text-amber-600 font-semibold mt-1">
                Chưa xác minh
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "info"
                  ? "color-primary/10 color-primary font-semibold"
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
                  ? "color-primary/10 color-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaLock />
              <span className="text-sm">Đổi mật khẩu</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8">
        <section className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-gray-900 text-3xl font-black tracking-tight mb-2">
              Hồ sơ giảng viên
            </h2>
            <p className="text-gray-600 text-base">
              Quản lý thông tin cá nhân và hồ sơ chuyên môn của bạn.
            </p>
          </div>

          {activeTab === "info" && (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* User Info Section */}
              <div>
                <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-sm font-semibold">
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full rounded-lg border h-12 px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-[#27A4F2] ${
                        errors.firstName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#27A4F2]"
                      }`}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <span className="text-red-500 text-xs">
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-sm font-semibold">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full rounded-lg border h-12 px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-[#27A4F2] ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#27A4F2]"
                      }`}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <span className="text-red-500 text-xs">
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-sm font-semibold">
                      Email
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 h-12 px-4 text-sm bg-gray-50 outline-none"
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-sm font-semibold">
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full rounded-lg border h-12 px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-[#27A4F2] ${
                        errors.dob
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#27A4F2]"
                      }`}
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    {errors.dob && (
                      <span className="text-red-500 text-xs">{errors.dob}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Teacher Profile Section */}
              <div>
                <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider mb-4">
                  Hồ sơ chuyên môn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-sm font-semibold">
                      Trình độ / Bằng cấp
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 h-12 px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-[#27A4F2] focus:border-[#27A4F2]"
                      type="text"
                      name="qualification"
                      placeholder="VD: Thạc sĩ Công nghệ Thông tin"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-900 text-sm font-semibold">
                      Chuyên ngành
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 h-12 px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-[#27A4F2] focus:border-[#27A4F2]"
                      type="text"
                      name="specialization"
                      placeholder="VD: Lập trình Web, AI/ML"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <label className="text-gray-900 text-sm font-semibold">
                    Kinh nghiệm giảng dạy
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none transition-all outline-none focus:ring-2 focus:ring-[#27A4F2]"
                    placeholder="Mô tả kinh nghiệm giảng dạy của bạn..."
                    rows={3}
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <label className="text-gray-900 text-sm font-semibold">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none transition-all outline-none focus:ring-2 focus:ring-[#27A4F2]"
                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                    rows={4}
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  className="flex items-center justify-center min-w-[140px] px-6 py-3 rounded-lg color-primary-bg text-white font-semibold hover:bg-[#0066a3] transition-all shadow-md shadow-[#0077BE]/20 disabled:opacity-50"
                  type="submit"
                  disabled={updatingProfile}
                >
                  {updatingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && <StudentPasswordChangeForm />}
        </section>
      </div>
    </div>
  );
};

export default TeacherSettingsPage;
