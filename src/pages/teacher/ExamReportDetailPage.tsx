import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import examReports from '../../data/reports';

const ExamReportDetailPage = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const report = examReports.find(r => r.id === id);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Không tìm thấy báo cáo</p>
      </div>
    );
  }

  const filteredResults = report.results.filter(result =>
    result.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return { label: 'ĐẠT', className: 'bg-green-100 text-green-700' };
      case 'failed':
        return { label: 'TRƯỢT', className: 'bg-red-100 text-red-700' };
      default:
        return { label: 'ĐANG HỌC', className: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-sm font-medium mb-2">
            <Link to="/teacher/reports" className="text-slate-500 hover:text-[#0074bd] transition-colors">Báo cáo</Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#111518]">Chi tiết</span>
          </nav>
          <h2 className="text-[#111518] text-2xl font-bold leading-tight tracking-tight">
            Báo cáo kết quả: {report.examTitle}
          </h2>
          <p className="text-[#617a89] text-sm mt-1">Cập nhật lần cuối: {report.lastUpdated}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-white border border-slate-200 text-[#111518] text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined mr-2 text-lg">filter_list</span>
            Lọc dữ liệu
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-[#0074bd] text-white text-sm font-bold shadow-md hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined mr-2 text-lg">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">groups</span>
            <p className="text-sm font-medium uppercase tracking-wider">Học viên tham gia</p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none">{report.totalParticipants}</p>
            <span className="text-green-600 text-sm font-semibold flex items-center mb-1">
              <span className="material-symbols-outlined text-base">arrow_upward</span>5%
            </span>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">star</span>
            <p className="text-sm font-medium uppercase tracking-wider">Điểm trung bình</p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none">{report.averageScore}</p>
            <span className="text-green-600 text-sm font-semibold flex items-center mb-1">
              <span className="material-symbols-outlined text-base">arrow_upward</span>0.2
            </span>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <p className="text-sm font-medium uppercase tracking-wider">Tỷ lệ đạt</p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none">{report.passRate}%</p>
            <span className="text-red-500 text-sm font-semibold flex items-center mb-1">
              <span className="material-symbols-outlined text-base">arrow_downward</span>2%
            </span>
          </div>
        </div>
        <div className="bg-white flex flex-col gap-2 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-xl">pending</span>
            <p className="text-sm font-medium uppercase tracking-wider">Chưa hoàn thành</p>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-semibold leading-none">{report.incompleteCount}</p>
            <span className="text-red-500 text-sm font-semibold flex items-center mb-1">
              <span className="material-symbols-outlined text-base">arrow_upward</span>10%
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Phân loại học lực</h3>
            <p className="text-slate-500 text-sm">Phân phối dựa trên điểm tổng kết</p>
          </div>
          <div className="flex items-center justify-around flex-1 py-4">
            {/* Donut visualization */}
            <div className="relative size-48 rounded-full border-16 border-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-16 border-t-[#0074bd] border-r-[#0074bd]/60 border-b-[#0074bd]/20 border-l-transparent rotate-45"></div>
              <div className="text-center">
                <span className="text-2xl font-semibold block">{report.passRate}%</span>
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-tighter">Đạt chuẩn</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#0074bd]"></div>
                <span className="text-sm font-medium">Giỏi ({report.gradeDistribution.excellent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#0074bd]/70"></div>
                <span className="text-sm font-medium">Khá ({report.gradeDistribution.good}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-[#0074bd]/40"></div>
                <span className="text-sm font-medium">Trung bình ({report.gradeDistribution.average}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-400"></div>
                <span className="text-sm font-medium">Yếu ({report.gradeDistribution.poor}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Performance Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Điểm trung bình theo câu hỏi</h3>
            <p className="text-slate-500 text-sm">Hiệu suất theo từng mục kiến thức</p>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 px-2 border-b border-slate-100">
            {report.questionPerformance.map((q) => (
              <div key={q.questionId} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className={`w-full rounded-t max-h-full transition-all duration-300 group-hover:opacity-80 ${
                    q.correctRate < 50 ? 'bg-red-400' : 'bg-[#0074bd]'
                  }`}
                  style={{ height: `${q.correctRate}%` }}
                ></div>
                <span className="text-[10px] font-bold text-slate-500">{q.questionId}</span>
              </div>
            ))}
          </div>
          {report.questionPerformance.some(q => q.correctRate < 50) && (
            <p className="mt-4 text-xs text-center text-slate-500 italic">
              Mẹo: Có {report.questionPerformance.filter(q => q.correctRate < 50).length} câu hỏi có tỉ lệ đúng thấp (dưới 50%)
            </p>
          )}
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Danh sách chi tiết học viên</h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#0074bd]/50 transition-all"
              placeholder="Tìm kiếm học viên..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Học viên</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Thời gian nộp bài</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Số lần thử</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Điểm số</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((result) => {
                const badge = getStatusBadge(result.status);
                return (
                  <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${result.studentColor}`}>
                          {result.studentInitials}
                        </div>
                        <span className="font-medium text-sm">{result.studentName}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${result.status === 'in_progress' ? 'text-slate-400 italic' : 'text-slate-500'}`}>
                      {result.submittedAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">{result.attempts}</td>
                    <td className="px-6 py-4 font-bold text-sm">
                      {result.score !== null ? result.score : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className={`text-[#0074bd] hover:underline text-sm font-semibold flex items-center gap-1 ${
                          result.status === 'in_progress' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={result.status === 'in_progress'}
                      >
                        Chi tiết 
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-500">Hiển thị {filteredResults.length} trên {report.results.length} học viên</p>
          <div className="flex gap-2">
            <button className="size-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-gray-50">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="size-8 flex items-center justify-center rounded bg-[#0074bd] text-white text-xs font-bold">1</button>
            <button className="size-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-gray-50">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReportDetailPage;
