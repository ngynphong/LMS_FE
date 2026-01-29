import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  // FaGoogle
} from "react-icons/fa";
// import { FaFacebookF } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../components/common/Toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  const validateEmail = (email: string): string => {
    if (!email) return "Email không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email) ? "Email không hợp lệ" : "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    // If no errors, proceed with login
    if (!emailError && !passwordError) {
      try {
        const error = await login(email, password);

        if (error) {
          // Show user-friendly error message instead of technical error
          const userFriendlyMessage = "Email hoặc mật khẩu không chính xác";
          toast.error(userFriendlyMessage);
          setErrors({ email: userFriendlyMessage });
        } else {
          toast.success("Đăng nhập thành công!");
          // Navigate based on user role
          // Navigate based on user role
          setTimeout(() => {
            const storedUser = localStorage.getItem("user");
            const currentUser = storedUser ? JSON.parse(storedUser) : user;

            if (currentUser?.role === "ADMIN") {
              navigate("/admin/dashboard");
            } else if (currentUser?.role === "TEACHER") {
              navigate("/teacher/dashboard");
            } else {
              navigate("/");
            }
          }, 100);
        }
      } catch (err) {
        toast.error("Email hoặc mật khẩu không chính xác");
        setErrors({ email: "Email hoặc mật khẩu không chính xác" });
      }
    }
  };

  // const handleGoogleLogin = () => {
  //   const OAuthConfig = {
  //     redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  //     authUri: import.meta.env.VITE_AUTH_URI,
  //     clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  //   };

  //   const callbackUrl = OAuthConfig.redirectUri;
  //   const authUrl = OAuthConfig.authUri;
  //   const googleClientId = OAuthConfig.clientId;

  //   const googleAuthUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
  //     callbackUrl,
  //   )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

  //   // Chuyển hướng người dùng
  //   window.location.href = googleAuthUrl;
  // };

  return (
    <main className="flex h-screen w-full">
      <div className="flex w-full flex-row h-full">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark h-full">
          <div
            className="absolute inset-0 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: "url('/img/login.png')",
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
                  src="/logo-edu.png"
                  alt="ies-edu-logo"
                  className="w-12 h-12"
                />
              </span>
              <span className="text-xl font-bold tracking-tight ">IES Edu</span>
            </Link>
            {/* <div className="absolute bottom-20 max-w-md">
              <h1 className="text-gray-800 text-5xl font-bold leading-tight mb-6">
                Học tập không giới hạn cùng IES Edu
              </h1>
              <p className="text-gray-800/90 text-xl font-light">
                Kiến tạo tương lai của bạn thông qua nền tảng học tập trực tuyến
                hiện đại nhất.
              </p>
            </div> */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white h-full overflow-y-auto p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center gap-2 mt-2 color-primary"
            >
              <span className="text-3xl">
                <img
                  src="/logo-edu.png"
                  alt="ies-edu-logo"
                  className="w-12 h-12"
                />
              </span>
              <span className="text-xl font-bold tracking-tight">IES Edu</span>
            </Link>

            {/* Tabs */}
            <div className="mb-10">
              <div className="flex border-b border-gray-200 gap-8">
                <Link
                  to="/login"
                  className="flex flex-col items-center justify-center border-b-[3px] border-b-color-primary color-primary pb-[13px] pt-4 flex-1"
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                    Đăng nhập
                  </p>
                </Link>
                <Link
                  to="/register"
                  className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 pb-[13px] pt-4 flex-1 hover:color-primary transition-colors"
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                    Đăng ký
                  </p>
                </Link>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-gray-900 text-3xl font-bold leading-tight mb-2">
                Chào mừng trở lại!
              </h2>
              <p className="text-gray-600 text-base font-normal">
                Vui lòng đăng nhập để tiếp tục.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-900 text-sm font-medium">
                  Email
                </label>
                <input
                  className={`w-full h-9 px-4 rounded-lg border ${errors.email ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} focus:outline-none focus:ring-1 transition-all`}
                  placeholder="email@example.com"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-900 text-sm font-medium">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    className={`w-full h-9 px-4 pr-12 rounded-lg border ${errors.password ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#27A4F2]"} focus:outline-none focus:ring-1 transition-all`}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-[20px]" />
                    ) : (
                      <FaEye className="text-[20px]" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    className="w-4 h-4 rounded border-gray-200 color-primary focus:ring-[#0077BE]"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <Link
                  className="text-sm font-medium color-primary hover:underline"
                  to="/forgot-password"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                className="w-full h-9 color-primary-bg hover:opacity-90 text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>
            </form>

            {/* Social Login */}
            {/* <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative px-4 bg-white text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoặc đăng nhập bằng
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  // onClick={handleGoogleLogin}
                  type="button"
                  className="flex items-center justify-center gap-3 h-11 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="w-5 h-5 text-[#4285F4]" />
                  <span className="text-sm font-medium text-gray-900">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 h-11 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFacebookF className="w-5 h-5 text-[#1877F2]" />
                  <span className="text-sm font-medium text-gray-900">
                    Facebook
                  </span>
                </button>
              </div>
            </div> */}

            {/* Sign Up Link */}
            <div className="mt-10 text-center">
              <p className="text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  className="color-primary font-bold hover:underline"
                  to="/register"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
