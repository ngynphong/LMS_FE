import {
  MdGroup,
  MdLocalLibrary,
  MdPayments,
  MdVisibility,
  MdCalendarToday,
  MdDownload,
} from "react-icons/md";
import { adminStats, approvalRequests } from "../../data/admin";

const AdminDashboardPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 text-[#101518]">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[#101518] tracking-tight">
            Tổng quan hệ thống
          </h2>
          <p className="text-[#5e7c8d] text-sm">
            Cập nhật lúc: {adminStats.lastUpdated}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-[#101518] px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <MdCalendarToday className="text-lg" />7 ngày qua
          </button>
          <button className="flex items-center gap-2 bg-[#0078bd] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0078bd]/90 transition-colors shadow-md shadow-[#0078bd]/20">
            <MdDownload className="text-lg" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdGroup className="text-[#0078bd] text-xl" />
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                adminStats.userGrowth >= 0
                  ? "text-[#078836] bg-[#078836]/10"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {adminStats.userGrowth >= 0 ? "+" : ""}
              {adminStats.userGrowth}%
            </span>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">Tổng người dùng</p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {adminStats.totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdLocalLibrary className="text-[#0078bd] text-xl" />
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                adminStats.activeCoursesGrowth >= 0
                  ? "text-[#078836] bg-[#078836]/10"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {adminStats.activeCoursesGrowth >= 0 ? "+" : ""}
              {adminStats.activeCoursesGrowth}%
            </span>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">
            Khóa học đang hoạt động
          </p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {adminStats.activeCourses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdPayments className="text-[#0078bd] text-xl" />
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                adminStats.revenueGrowth >= 0
                  ? "text-[#078836] bg-[#078836]/10"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {adminStats.revenueGrowth >= 0 ? "+" : ""}
              {adminStats.revenueGrowth}%
            </span>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">
            Doanh thu tháng này
          </p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {(adminStats.revenue / 1000000000).toFixed(1)} tỷ đ
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#0078bd]/10 rounded-lg">
              <MdVisibility className="text-[#0078bd] text-xl" />
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                adminStats.visitsGrowth >= 0
                  ? "text-[#078836] bg-[#078836]/10"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {adminStats.visitsGrowth >= 0 ? "+" : ""}
              {adminStats.visitsGrowth}%
            </span>
          </div>
          <p className="text-[#5e7c8d] text-sm font-medium">
            Lượt truy cập hôm nay
          </p>
          <p className="text-[#101518] text-3xl font-bold mt-1">
            {adminStats.visits.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-[#101518]">
              Tăng trưởng Người dùng & Doanh thu
            </h3>
            <p className="text-sm text-[#5e7c8d] mt-1">
              Dữ liệu thống kê trong 6 tháng gần nhất
            </p>
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
        <div className="p-6">
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
                d="M0 275 C 100 250, 200 260, 300 180 C 400 200, 500 150, 600 120 C 700 130, 800 80, 900 60 C 1000 70 L 1000 275 L 0 275 Z"
                fill="rgba(0,120,189, 0.05)"
              />

              {/* User Growth Line (Primary) */}
              <path
                d="M0 250 C 150 220, 300 200, 450 120 S 750 100, 900 40 L 1000 30"
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
              ].map((month) => (
                <span key={month} className="text-xs font-bold text-[#5e7c8d]">
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Approvals Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-[#101518]">
            Yêu cầu phê duyệt khóa học
          </h3>
          <button className="text-[#0078bd] text-sm font-bold hover:underline">
            Xem tất cả yêu cầu
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-[#5e7c8d] uppercase tracking-wider">
                  Tên khóa học
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#5e7c8d] uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#5e7c8d] uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#5e7c8d] uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#5e7c8d] uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvalRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400">
                        <span className="material-symbols-outlined text-xl">
                          image
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#101518]">
                        {request.courseName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5e7c8d] font-medium">
                    {request.instructorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5e7c8d]">
                    {request.submittedDate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 bg-[#078836] text-white text-xs font-bold rounded-lg hover:bg-[#078836]/90 transition-colors shadow-sm">
                        Phê duyệt
                      </button>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors">
                        Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
