import React, { useState } from "react";
import { useCreateTeacher } from "../../hooks/useAdmin";
import type { CreateTeacherRequest } from "../../types/admin";
import {
  MdArrowBack,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CreateTeacherPage = () => {
  const navigate = useNavigate();
  const { mutate: createTeacher, isPending } = useCreateTeacher();

  const [formData, setFormData] = useState<CreateTeacherRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    roleName: "TEACHER",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTeacherRequest, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTeacherRequest, string>> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ đệm";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Vui lòng chọn ngày sinh";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name as keyof CreateTeacherRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createTeacher(formData, {
      onSuccess: () => {
        navigate("/admin/users");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#101518]">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <MdArrowBack className="text-xl text-[#5e7c8d]" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#101518] tracking-tight">
            Thêm mới Giáo viên
          </h2>
          <p className="text-[#5e7c8d] text-sm">
            Tạo tài khoản mới cho giáo viên
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#101518]">
                Họ đệm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.firstName
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-[#0078bd]/20 focus:border-[#0078bd]"
                }`}
                placeholder="Nguyễn Văn"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#101518]">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.lastName
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-[#0078bd]/20 focus:border-[#0078bd]"
                }`}
                placeholder="A"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#101518]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-[#0078bd]/20 focus:border-[#0078bd]"
                }`}
                placeholder="teacher@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#101518]">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#0078bd]/20 focus:border-[#0078bd]"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0078bd]"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#101518]">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.dob
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-[#0078bd]/20 focus:border-[#0078bd]"
                }`}
              />
              {errors.dob && (
                <p className="text-xs text-red-500">{errors.dob}</p>
              )}
            </div>

            {/* Role (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#101518]">
                Vai trò
              </label>
              <input
                type="text"
                value="Giáo viên (TEACHER)"
                disabled
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-white border border-slate-200 text-[#5e7c8d] font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2 bg-[#0078bd] text-white font-bold rounded-lg hover:bg-[#0078bd]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <MdSave className="text-lg" />
                  <span>Tạo tài khoản</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacherPage;
