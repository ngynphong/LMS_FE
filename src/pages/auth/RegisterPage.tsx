import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
// import { toast } from '../../components/common/Toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    // if (!/[A-Z]/.test(password)) errors.push('Phải có ít nhất 1 chữ hoa');
    if (!/[a-z]/.test(password)) errors.push("Phải có ít nhất 1 chữ thường");
    if (!/[0-9]/.test(password)) errors.push("Phải có ít nhất 1 số");
    return errors;
  };

  const validateAge = (dob: string): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 13;
    }
    return age >= 13;
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
        return value.trim().length < 2 ? "Tên phải có ít nhất 2 ký tự" : "";
      case "lastName":
        return value.trim().length < 2 ? "Họ phải có ít nhất 2 ký tự" : "";
      case "email":
        return !validateEmail(value) ? "Email không hợp lệ" : "";
      case "password":
        const pwdErrors = validatePassword(value);
        return pwdErrors.length > 0 ? pwdErrors[0] : "";
      case "dob":
        if (!value) return "Vui lòng chọn ngày sinh";
        const birthDate = new Date(value);
        if (birthDate > new Date()) return "Ngày sinh không được là tương lai";
        return !validateAge(value) ? "Bạn phải từ 13 tuổi trở lên" : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (!agreeToTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản và chính sách";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Send dob as string (backend expects ISO date string format like "2026-01-22")
        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.dob,
        );

        // Registration successful - toast is shown in auth context
        // Navigate to login or email verification page
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
            },
          });
        }, 1000);
      } catch (err) {
        // Error is already handled in auth context
        console.error("Registration error:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Side - Hero Image */}
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/img/register.png')",
            backgroundSize: "80%",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <Link
            to="/"
            className="absolute top-10 left-10 flex items-center gap-2 color-primary hover:opacity-90 transition-opacity"
          >
            <span className="text-3xl">
              <img
                src="/img/logo-edu.png"
                alt="ies-edu-logo"
                className="w-12 h-12"
              />
            </span>
            <span className="text-xl font-bold tracking-tight ">IES EDU</span>
          </Link>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-6 px-4 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <Link
            to="/"
            className="md:hidden flex items-center gap-2 mb-6 color-primary"
          >
            <span className="text-2xl">
              <img
                src="/img/logo-edu.png"
                alt="ies-edu-logo"
                className="w-12 h-12"
              />
            </span>
            <span className="text-lg font-bold tracking-tight">IES EDU</span>
          </Link>

          {/* Tabs */}
          <div className="pb-4">
            <div className="flex border-b border-gray-200 gap-8">
              <Link
                to="/login"
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 pb-[13px] pt-4 transition-colors hover:color-primary"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Đăng nhập
                </p>
              </Link>
              <Link
                to="/register"
                className="flex flex-col items-center justify-center border-b-[3px] border-[#1E90FF] color-primary pb-[13px] pt-4"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  Đăng ký
                </p>
              </Link>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-2">
            <h1 className="text-gray-900 tracking-tight text-2xl font-bold leading-tight pb-1">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-600 text-sm font-normal leading-normal">
              Tham gia cộng đồng học tập IES EDU ngay hôm nay.
            </p>
          </div>

          {/* Registration Form */}
          <form className="space-y-2" onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 text-sm font-medium leading-normal">
                  Họ
                </label>
                <input
                  className={`form-input flex w-full rounded-lg text-gray-900 focus:outline-0 focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} border bg-white h-9 placeholder:text-gray-500 px-3 py-2 text-sm font-normal`}
                  placeholder="Họ"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 text-sm font-medium leading-normal">
                  Tên
                </label>
                <input
                  className={`form-input flex w-full rounded-lg text-gray-900 focus:outline-0 focus:ring-2 ${errors.firstName ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} border bg-white h-9 placeholder:text-gray-500 px-3 py-2 text-sm font-normal`}
                  placeholder="Tên"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.firstName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-900 text-sm font-medium leading-normal">
                Email
              </label>
              <input
                className={`form-input flex w-full rounded-lg text-gray-900 focus:outline-0 focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} border bg-white h-9 placeholder:text-gray-500 px-3 py-2 text-sm font-normal`}
                placeholder="example@email.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Date of Birth & Role */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-900 text-sm font-medium leading-normal">
                Ngày sinh
              </label>
              <input
                className={`form-input flex w-full rounded-lg text-gray-900 focus:outline-0 focus:ring-2 ${errors.dob ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} border bg-white h-9 placeholder:text-gray-500 px-3 py-2 text-sm font-normal`}
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.dob && (
                <p className="text-red-500 text-xs mt-0.5">{errors.dob}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-900 text-sm font-medium leading-normal">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  className={`form-input flex w-full rounded-lg text-gray-900 focus:outline-0 focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} border bg-white h-9 placeholder:text-gray-500 px-3 py-2 pr-10 text-sm font-normal`}
                  placeholder="Nhập mật khẩu"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-[18px]" />
                  ) : (
                    <FaEye className="text-[18px]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2 py-1">
                <input
                  className="h-4 w-4 mt-0.5 rounded border-gray-200 color-primary focus:ring-[#27A4F2] cursor-pointer"
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label
                  className="text-xs text-gray-600 leading-normal"
                  htmlFor="terms"
                >
                  Tôi đồng ý với{" "}
                  <span className="color-primary font-bold hover:underline">
                    Điều khoản
                  </span>{" "}
                  và{" "}
                  <span className="color-primary font-bold hover:underline">
                    Chính sách bảo mật
                  </span>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-0.5">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="w-full flex items-center justify-center rounded-lg h-10 px-5 color-primary-bg text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-colors shadow-lg shadow-[#0077BE]/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang đăng ký...</span>
                </>
              ) : (
                <span>Đăng ký ngay</span>
              )}
            </button>
          </form>

          {/* Social Login Separator */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-gray-500">
              Hoặc đăng ký bằng
            </span>
          </div>

          {/* Footer Link */}
          <p className="text-center text-xs text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              className="color-primary font-bold hover:underline"
              to="/login"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
