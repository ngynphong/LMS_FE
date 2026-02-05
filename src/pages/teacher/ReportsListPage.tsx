import { useState } from "react";
import { Link } from "react-router-dom";
import { useTeacherQuizzes } from "../../hooks/useQuizzes";

const ReportsListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: quizzes, isLoading, error } = useTeacherQuizzes();

  const filteredReports =
    quizzes?.filter((quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-[#111518] text-2xl font-bold tracking-tight">
            Báo cáo kết quả
          </h1>
          <p className="text-[#617a89] text-sm mt-1">
            Xem và phân tích kết quả các bài kiểm tra
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
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
      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
            progress_activity
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          Có lỗi xảy ra khi tải danh sách bài kiểm tra.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-[#111518] text-base font-bold leading-tight line-clamp-2">
                    {quiz.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      quiz.type === "QUIZ"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {quiz.type === "QUIZ" ? "Bài thi" : "Luyện tập"}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-[#111518]">
                      {quiz.durationInMinutes}'
                    </p>
                    <p className="text-xs text-slate-500">Thời gian</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-[#111518]">
                      {quiz.totalQuestions}
                    </p>
                    <p className="text-xs text-slate-500">Câu hỏi</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
                  <span>
                    <span className="font-semibold">Trạng thái: </span>
                    {quiz.isPublished ? (
                      <span className="text-green-600 font-medium">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Nháp</span>
                    )}
                  </span>
                </div>

                <Link
                  to={`/teacher/reports/${quiz.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    analytics
                  </span>
                  Xem chi tiết báo cáo
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredReports.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">
            search_off
          </span>
          <p className="text-slate-500">
            {searchQuery
              ? "Không tìm thấy bài kiểm tra nào phù hợp"
              : "Chưa có bài kiểm tra nào"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsListPage;
