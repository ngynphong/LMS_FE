import { useState } from "react";
import { Link } from "react-router-dom";
import { useTeacherQuizzes } from "../../hooks/useQuizzes";

const ExamListPage = () => {
  const { data: exams, loading, error } = useTeacherQuizzes();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered exams
  const filteredExams = (exams || []).filter((e) => {
    const matchesSearch = e.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách đề thi.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">
            Quản lý đề thi
          </h1>
          <p className="text-[#617a89] text-sm mt-1">
            Tạo và quản lý các bài kiểm tra, đề thi
          </p>
        </div>
        <Link
          to="/teacher/exams/new"
          className="color-primary-bg hover:translate-y-[-2px] duration-300 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Tạo đề thi mới
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-[#0074bd] text-sm"
              placeholder="Tìm kiếm đề thi..."
            />
          </div>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-[#111518] text-base font-bold leading-tight line-clamp-2">
                  {exam.title}
                </h3>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${exam.isDynamic ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {exam.isDynamic ? "Dynamic" : "Static"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    quiz
                  </span>
                  <span>{exam.totalQuestions} câu</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    schedule
                  </span>
                  <span>{exam.durationInMinutes} phút</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Link
                  to={`/teacher/exams/${exam.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    edit
                  </span>
                  Chỉnh sửa
                </Link>
                <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors">
                  <span className="material-symbols-outlined text-base">
                    delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredExams.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500">
            Chưa có đề thi nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamListPage;
