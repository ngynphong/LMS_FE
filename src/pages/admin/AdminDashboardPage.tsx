import {
  MdGroup,
  MdLocalLibrary,
  MdPayments,
  MdVisibility,
} from "react-icons/md";
import { useAdminDashboard } from "@/hooks/useAdmin";

const AdminDashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useAdminDashboard();
  const stats = dashboardData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0078bd]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Đã có lỗi xảy ra khi tải dữ liệu: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-[#101518]">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[#101518] tracking-tight">
            Tổng quan hệ thống
          </h2>
          <p className="text-[#5e7c8d] text-sm">
            Cập nhật lúc: {new Date().toLocaleString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdGroup className="text-[#0078bd] text-xl" />
            </div>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">Tổng người dùng</p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {stats?.totalUsers?.toLocaleString()}
          </p>
          <div className="mt-2 text-xs text-[#5e7c8d] flex gap-2">
            <span>
              Học viên: <b>{stats?.totalStudents?.toLocaleString()}</b>
            </span>
            <span>
              Giáo viên: <b>{stats?.totalTeachers?.toLocaleString()}</b>
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdLocalLibrary className="text-[#0078bd] text-xl" />
            </div>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">
            Khóa học đang hoạt động
          </p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {stats?.activeCourses?.toLocaleString()}{" "}
            <span className="text-sm font-normal text-gray-500">
              / {stats?.totalCourses?.toLocaleString()}
            </span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdPayments className="text-[#0078bd] text-xl" />
            </div>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">
            Người dùng trực tuyến
          </p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {stats?.currentOnlineUsers?.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdVisibility className="text-[#0078bd] text-xl" />
            </div>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">
            Lượt truy cập hôm nay
          </p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {stats?.todayVisitors?.toLocaleString()}
          </p>
          <p className="text-xs text-[#5e7c8d] mt-1">
            Tổng lượt xem: {stats?.totalPageViews?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-[#101518]">
              Tăng trưởng Người dùng
            </h3>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#0078bd]"></span>
              <span className="text-xs font-medium text-[#5e7c8d]">
                Người dùng
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-slate-300"></span>
              <span className="text-xs font-medium text-[#5e7c8d]">
                Doanh thu
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 mb-6">
          <div className="h-[300px] w-full relative">
            <svg
              fill="none"
              height="100%"
              preserveAspectRatio="none"
              viewBox="0 0 1000 300"
              width="100%"
              className="overflow-visible"
            >
              {/* Grid Lines */}
              {[50, 125, 200, 275].map((y) => (
                <line
                  key={y}
                  stroke="#dae2e7"
                  strokeDasharray="4 4"
                  x1="0"
                  x2="1000"
                  y1={y}
                  y2={y}
                />
              ))}

              {/* Revenue Area (Secondary) */}
              <path
                d="M0 275 C 100 250, 200 260, 300 180 C 400 200, 500 150, 600 120 C 700 130, 800 80, 900 60 L 1000 70 L 1000 275 L 0 275 Z"
                fill="rgba(0,120,189, 0.05)"
              />

              {/* User Growth Line (Primary) */}
              <path
                d="M0 250 C 150 220, 300 200, 450 120 S 750 100, 900 40 L 1000 30m"
                fill="none"
                stroke="#0078bd"
                strokeLinecap="round"
                strokeWidth="4"
              />

              {/* Points */}
              {[
                [150, 220],
                [450, 120],
                [750, 100],
                [900, 40],
                [1050, 20],
                [1200, 60],
                [1350, 100],
                [1500, 140],
                [1650, 180],
                [1800, 220],
                [1950, 260],
                [2100, 300],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  fill="#0078bd"
                  r="6"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="flex justify-between mt-4 px-2">
              {[
                "THÁNG 1",
                "THÁNG 2",
                "THÁNG 3",
                "THÁNG 4",
                "THÁNG 5",
                "THÁNG 6",
                "THÁNG 7",
                "THÁNG 8",
                "THÁNG 9",
                "THÁNG 10",
                "THÁNG 11",
                "THÁNG 12",
              ].map((month) => (
                <span key={month} className="text-xs font-bold text-[#5e7c8d]">
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
