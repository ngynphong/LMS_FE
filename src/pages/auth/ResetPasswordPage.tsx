import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const { verifyOtp } = useAuth();

  // Redirect nếu không có email
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const validateOtp = (otp: string): string => {
    if (!otp) return "Vui lòng nhập mã OTP";
    if (otp.length !== 6) return "Mã OTP phải có 6 chữ số";
    if (!/^\d+$/.test(otp)) return "Mã OTP chỉ chứa số";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!/[A-Z]/.test(password)) return "Phải có ít nhất 1 chữ hoa";
    if (!/[a-z]/.test(password)) return "Phải có ít nhất 1 chữ thường";
    if (!/[0-9]/.test(password)) return "Phải có ít nhất 1 số";
    return "";
  };

  const validateConfirmPassword = (confirmPwd: string): string => {
    if (!confirmPwd) return "Vui lòng xác nhận mật khẩu";
    if (newPassword !== confirmPwd) return "Mật khẩu không khớp";
    return "";
  };

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setOtp(numericValue);
    if (touched.otp) {
      setErrors({ ...errors, otp: validateOtp(numericValue) });
    }
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (touched.newPassword) {
      setErrors({ ...errors, newPassword: validatePassword(value) });
    }
    // Also revalidate confirm password if it's been touched
    if (touched.confirmPassword && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: validatePassword(value),
        confirmPassword: value !== confirmPassword ? "Mật khẩu không khớp" : "",
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
    }
  };

  const handleOtpBlur = () => {
    setTouched((prev) => ({ ...prev, otp: true }));
    setErrors((prev) => ({ ...prev, otp: validateOtp(otp) }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, newPassword: true }));
    setErrors((prev) => ({
      ...prev,
      newPassword: validatePassword(newPassword),
    }));
  };

  const handleConfirmPasswordBlur = () => {
    setTouched((prev) => ({ ...prev, confirmPassword: true }));
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(confirmPassword),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ otp: true, newPassword: true, confirmPassword: true });

    const newErrors: Record<string, string> = {};

    // Validate all fields
    const otpError = validateOtp(otp);
    if (otpError) newErrors.otp = otpError;

    const passwordError = validatePassword(newPassword);
    if (passwordError) newErrors.newPassword = passwordError;

    const confirmError = validateConfirmPassword(confirmPassword);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        await verifyOtp(email, otp, newPassword);
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/login");
      } catch (error) {
        console.error("Error resetting password:", error);
        setIsLoading(false);
        const errorMessage =
          error instanceof Error ? error.message : "Lỗi khi đặt lại mật khẩu";
        toast.error(errorMessage);
      }
    }
  };

  // const handleResendOTP = () => {
  //   setTimeLeft(600);
  //   setOtp('');
  //   setTouched({});
  //   setErrors({});
  //   // TODO: Call API to resend OTP
  //   toast.success('Đã gửi lại mã OTP!');
  // };

  return (
    <main className="flex h-screen w-full">
      <div className="flex w-full flex-row h-full">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark h-full">
          <div
            className="absolute inset-0 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: "url('/img/reset-password.png')",
              backgroundSize: "80%", // Scale it down a bit to valid breathing room
            }}
          ></div>
          <div className="absolute inset-0 color-primary/75 flex flex-col items-center justify-center p-12 text-center">
            <Link
              to="/"
              className="absolute top-10 left-10 flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl">
                <img
                  src="/ies-edu-logo.png"
                  alt="ies-edu-logo"
                  className="w-12 h-12"
                />
              </span>
              <span className="text-xl color-primary font-bold tracking-tight">
                IES EDU
              </span>
            </Link>
            {/* <div className="max-w-md absolute bottom-20">
              <h1 className="text-black text-5xl font-bold leading-tight mb-6">
                Gần xong rồi!
              </h1>
              <p className="text-black/90 text-xl font-light">
                Chỉ còn vài bước nữa để bạn có thể quay lại học tập.
              </p>
            </div> */}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white h-full overflow-y-auto p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <Link
              to="/"
              className="lg:hidden flex items-center gap-2 mb-10 color-primary"
            >
              <span className="text-3xl">
                <img
                  src="/ies-edu-logo.png"
                  alt="ies-edu-logo"
                  className="w-12 h-12"
                />
              </span>
              <span className="text-xl font-bold tracking-tight">IES EDU</span>
            </Link>

            {/* Back Button */}
            <Link
              to="/forgot-password"
              className="flex items-center gap-2 text-gray-600 hover:color-primary transition-colors mb-8"
            >
              <FaArrowLeft className="text-sm" />
              <span className="text-sm font-medium">Quay lại</span>
            </Link>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-gray-900 text-3xl font-bold leading-tight mb-2">
                Đặt lại mật khẩu
              </h2>
              <p className="text-gray-600 text-sm font-normal">
                Mã OTP đã được gửi đến <strong>{email}</strong>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Thời gian còn lại:{" "}
                <span
                  className={`font-bold ${timeLeft < 60 ? "text-red-500" : "color-primary"}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* OTP Input */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 text-sm font-medium">
                  Mã OTP
                </label>
                <input
                  className={`w-full h-9 px-4 rounded-lg border ${errors.otp ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#0077BE]"} focus:outline-none focus:ring-1 transition-all text-center text-lg tracking-widest font-mono`}
                  placeholder="000000"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  onBlur={handleOtpBlur}
                  required
                />
                {errors.otp && touched.otp && (
                  <p className="text-red-500 text-xs mt-0.5">{errors.otp}</p>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 text-sm font-medium">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    className={`w-full h-9 px-4 pr-10 rounded-lg border ${errors.newPassword ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#0077BE]"} focus:outline-none focus:ring-1 transition-all`}
                    placeholder="Nhập mật khẩu mới"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="text-[16px]" />
                    ) : (
                      <FaEye className="text-[16px]" />
                    )}
                  </button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-900 text-sm font-medium">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    className={`w-full h-9 px-4 pr-10 rounded-lg border ${errors.confirmPassword ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:ring-[#0077BE]"} focus:outline-none focus:ring-1 transition-all`}
                    placeholder="Nhập lại mật khẩu mới"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    onBlur={handleConfirmPasswordBlur}
                    required
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-[16px]" />
                    ) : (
                      <FaEye className="text-[16px]" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                className="w-full h-9 color-primary-bg hover:opacity-90 text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                type="submit"
                disabled={isLoading || timeLeft <= 0}
              >
                {isLoading ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <span>Đặt lại mật khẩu</span>
                )}
              </button>
            </form>

            {/* Resend OTP */}
            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Không nhận được mã?{' '}
                <button 
                  className="color-primary font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResendOTP}
                  disabled={timeLeft > 540} // Chỉ cho phép gửi lại sau 1 phút
                >
                  Gửi lại
                </button>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
