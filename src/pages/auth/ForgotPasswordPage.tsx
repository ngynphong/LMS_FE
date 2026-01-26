import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSchool } from 'react-icons/io5';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const validateEmail = (email: string): string => {
    if (!email) return 'Email không được để trống';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email) ? 'Email không hợp lệ' : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');

    // TODO: Call API to send OTP
    try {
      await forgotPassword(email);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Lỗi không xác định');
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to reset password page with email
      navigate('/reset-password', { state: { email } });
    }, 1500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <main className="flex h-screen w-full">
      <div className="flex w-full flex-row h-full">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBL-bY1tYY_F0tHLhwECNkQoQxSjoSenqDgVjh6zfzSJb9dfK4McqIbqfBAnE7fpOOdB1SVqzU7y3zk23LgXfCp_es6Jsg-ROjrbCo0Yo1XI9v_DWCRfiGUBdroSqlZ0cg9g94qkTVxpN7X4qkvjo0GUwdwWOp4TCUlwTDx1E4wLzWJXqTk8gTNh859n95hmrqlpTVoqzbxxpYXMxOcHpLr5c5t2b7FUr2OiDbY2Ntoh1DKxxBcOkuijJdD0kBteaEqwiUF3gnDXMdo')" }}
          ></div>
          <div className="absolute inset-0 bg-[#0077BE]/75 flex flex-col items-center justify-center p-12 text-center">
            <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <span className="text-3xl"><IoSchool /></span>
              <span className="text-xl font-bold tracking-tight">Edu LMS</span>
            </Link>
            <div className="max-w-md">
              <h1 className="text-white text-5xl font-bold leading-tight mb-6">
                Đừng lo lắng!
              </h1>
              <p className="text-white/90 text-xl font-light">
                Chúng tôi sẽ giúp bạn khôi phục mật khẩu và quay lại học tập ngay lập tức.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white h-full overflow-y-auto p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-10 text-[#0077BE]">
              <span className="text-3xl"><IoSchool /></span>
              <span className="text-xl font-bold tracking-tight">Edu LMS</span>
            </Link>

            {/* Back to Login */}
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-gray-600 hover:text-[#0077BE] transition-colors mb-8"
            >
              <FaArrowLeft className="text-sm" />
              <span className="text-sm font-medium">Quay lại đăng nhập</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-gray-900 text-3xl font-bold leading-tight mb-2">
                Quên mật khẩu?
              </h2>
              <p className="text-gray-600 text-base font-normal">
                Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-900 text-sm font-medium">Email</label>
                <input 
                  className={`w-full h-9 px-4 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#0077BE]'} focus:outline-none focus:ring-1 transition-all`}
                  placeholder="email@example.com"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                {error && (
                  <p className="text-red-500 text-xs mt-0.5">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <button 
                className="w-full h-9 bg-[#0077BE] hover:bg-[#0077BE]/90 text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Đang gửi...</span>
                ) : (
                  <span>Gửi mã OTP</span>
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                💡 <strong>Lưu ý:</strong> Mã OTP sẽ được gửi đến email của bạn và có hiệu lực trong 10 phút.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
