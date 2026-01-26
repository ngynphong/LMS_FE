import { useState } from 'react';
import { Link } from 'react-router-dom';
import examReports from '../../data/reports';

const ReportsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = examReports.filter(report =>
    report.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">Báo cáo kết quả</h1>
          <p className="text-[#617a89] text-sm mt-1">Xem và phân tích kết quả các bài kiểm tra</p>
        </div>
        <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-[#0074bd] text-white text-sm font-bold shadow-md hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined mr-2 text-lg">download</span>
          Xuất tổng hợp
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm"
            placeholder="Tìm kiếm bài thi..."
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-[#111518] text-base font-bold leading-tight line-clamp-2">
                  {report.examTitle}
                </h3>
              </div>
              
              <p className="text-xs text-[#0074bd] font-medium mb-4">
                <span className="material-symbols-outlined text-sm align-middle mr-1">book</span>
                {report.courseName}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-semibold text-[#111518]">{report.totalParticipants}</p>
                  <p className="text-xs text-slate-500">Học viên</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-semibold text-[#111518]">{report.averageScore}</p>
                  <p className="text-xs text-slate-500">Điểm TB</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-semibold text-green-600">{report.passRate}%</p>
                  <p className="text-xs text-green-600">Tỷ lệ đạt</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-semibold text-yellow-600">{report.incompleteCount}</p>
                  <p className="text-xs text-yellow-600">Chưa hoàn thành</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4">
                <span className="material-symbols-outlined text-sm align-middle mr-1">schedule</span>
                Cập nhật: {report.lastUpdated}
              </p>

              <Link
                to={`/teacher/reports/${report.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-colors"
              >
                <span className="material-symbols-outlined text-base">analytics</span>
                Xem chi tiết báo cáo
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">search_off</span>
          <p className="text-slate-500">Không tìm thấy báo cáo nào</p>
        </div>
      )}
    </div>
  );
};

export default ReportsListPage;
