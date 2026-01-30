import { useState } from 'react';
import { Link } from 'react-router-dom';
import examsData from '../../data/exams';
import type { Exam } from '../../types/exam';

const ExamListPage = () => {
  const [exams] = useState<Exam[]>(examsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats
  const totalExams = exams.length;
  const publishedCount = exams.filter(e => e.status === 'published').length;
  const draftCount = exams.filter(e => e.status === 'draft').length;

  // Filtered exams
  const filteredExams = exams.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Exam['status']) => {
    switch (status) {
      case 'published':
        return { label: 'Đang mở', className: 'bg-green-100 text-green-700' };
      case 'draft':
        return { label: 'Bản nháp', className: 'bg-yellow-100 text-yellow-700' };
      case 'closed':
        return { label: 'Đã đóng', className: 'bg-slate-100 text-slate-600' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">Quản lý đề thi</h1>
          <p className="text-[#617a89] text-sm mt-1">Tạo và quản lý các bài kiểm tra, đề thi</p>
        </div>
        <Link
          to="/teacher/exams/new"
          className="color-primary-bg hover:translate-y-[-2px] duration-300 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Tạo đề thi mới
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm"
              placeholder="Tìm kiếm đề thi..."
            />
          </div>
        </div>
        <div className="relative min-w-[150px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm pr-10"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="published">Đang mở</option>
            <option value="draft">Bản nháp</option>
            <option value="closed">Đã đóng</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-[#0074bd]/10 p-3 rounded-lg">
            <span className="material-symbols-outlined text-[#0074bd] text-2xl">description</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Tổng số đề thi</p>
            <p className="text-2xl font-bold text-[#111518]">{totalExams}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Đang mở</p>
            <p className="text-2xl font-bold text-[#111518]">{publishedCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <span className="material-symbols-outlined text-yellow-600 text-2xl">edit_note</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Bản nháp</p>
            <p className="text-2xl font-bold text-[#111518]">{draftCount}</p>
          </div>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const badge = getStatusBadge(exam.status);
          return (
            <div key={exam.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-[#111518] text-base font-bold leading-tight line-clamp-2">
                    {exam.title}
                  </h3>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{exam.description}</p>
                
                {exam.courseName && (
                  <p className="text-xs text-[#0074bd] font-medium mb-3">
                    <span className="material-symbols-outlined text-sm align-middle mr-1">book</span>
                    {exam.courseName}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">quiz</span>
                    <span>{exam.questionCount} câu</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>{exam.duration} phút</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Link
                    to={`/teacher/exams/${exam.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Chỉnh sửa
                  </Link>
                  <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExamListPage;
