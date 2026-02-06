/**
 * Teacher Settings Page
 * Placeholder page for future settings implementation
 */

const TeacherSettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">
            Cài đặt
          </h1>
          <p className="text-[#617a89] text-sm mt-1">
            Quản lý cài đặt tài khoản và thông báo
          </p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
          settings
        </span>
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          Tính năng đang phát triển
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Trang cài đặt đang được xây dựng. Bạn sẽ có thể tùy chỉnh thông tin cá
          nhân, mật khẩu, và các thiết lập thông báo tại đây.
        </p>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-blue-500">
              person
            </span>
            <h3 className="font-semibold text-slate-700">Thông tin cá nhân</h3>
          </div>
          <p className="text-sm text-slate-500">
            Cập nhật tên, email, ảnh đại diện
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-green-500">
              lock
            </span>
            <h3 className="font-semibold text-slate-700">Bảo mật</h3>
          </div>
          <p className="text-sm text-slate-500">Đổi mật khẩu, xác thực 2 lớp</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 opacity-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-purple-500">
              notifications
            </span>
            <h3 className="font-semibold text-slate-700">Thông báo</h3>
          </div>
          <p className="text-sm text-slate-500">
            Tùy chỉnh email và push notifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettingsPage;
