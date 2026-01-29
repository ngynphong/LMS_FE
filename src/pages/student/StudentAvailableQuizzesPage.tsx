import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAccessTime,
  MdFormatListBulleted,
  MdEventBusy,
  MdEvent,
  MdArrowForward,
  MdQuiz,
} from "react-icons/md";
import type { Quiz } from "../../types/exam";



const StudentAvailableQuizzesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const quizzes: Quiz[] = [
    {
      id: 1,
      category: "Lập trình Web",
      status: "open",
      statusLabel: "Đang mở",
      title: "Kiểm tra giữa kỳ - ReactJS",
      duration: "45 phút",
      questions: 30,
      deadline: "05/02/2026",
      isAvailable: true,
    },
    {
      id: 2,
      category: "Data Science",
      status: "open",
      statusLabel: "Đang mở",
      title: "Quiz 5: Python Pandas & Numpy",
      duration: "20 phút",
      questions: 15,
      deadline: "10/02/2026",
      isAvailable: true,
    },
    {
      id: 3,
      category: "English",
      status: "upcoming",
      statusLabel: "Sắp diễn ra",
      title: "Final Test: Business English",
      duration: "90 phút",
      questions: 50,
      startDate: "15/02/2026",
      isAvailable: false,
    },
    {
      id: 4,
      category: "Network",
      status: "closed",
      statusLabel: "Đã kết thúc",
      title: "CCNA Module 1",
      duration: "60 phút",
      questions: 40,
      deadline: "20/01/2026",
      isAvailable: false,
    },
  ];

  const filteredQuizzes =
    filter === "all"
      ? quizzes
      : quizzes.filter((q) => {
          if (filter === "upcoming") return q.status === "upcoming";
          if (filter === "open") return q.status === "open";
          if (filter === "closed") return q.status === "closed";
          return true;
        });

  return (
    // FIX 1: Xóa overflow-hidden ở đây. Dùng min-h-screen để đảm bảo layout full height nhưng không cắt content.
    <div className="flex flex-col w-full min-h-[calc(100vh-100px)]">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:gap-3 mb-6 md:mb-8">
        <h1 className="text-[#111827] text-2xl md:text-3xl font-black leading-tight tracking-tight">
          Bài thi & Quiz khả dụng
        </h1>
        <p className="text-gray-600 text-sm md:text-base font-normal max-w-2xl">
          Danh sách các bài kiểm tra hiện có. Hãy hoàn thành đúng hạn.
        </p>
      </div>

      {/* FIX 2: Sticky Header & Tabs 
          - Dùng top-0 và z-10 để dính lên trên khi scroll.
          - Negative Margin (-mx-4) giúp tràn viền trên mobile, nhưng padding (px-4) giữ nội dung thẳng hàng.
      */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm -mx-4 px-4 md:static md:bg-transparent md:mx-0 md:px-0 mb-6 transition-all duration-200">
        <div className="w-full border-b border-gray-200/60">
          {/* FIX 3: Thêm pb-1 để tránh việc Indicator (thanh gạch dưới) bị cắt mất phần đáy */}
          <div className="overflow-x-auto scrollbar-hide pb-1 -mb-px">
            <div className="flex gap-6 md:gap-8 min-w-max px-1">
              {[
                { id: "all", label: "Tất cả" },
                { id: "upcoming", label: "Sắp diễn ra" },
                { id: "open", label: "Đang mở" },
                { id: "closed", label: "Đã kết thúc" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`
                    relative py-3 text-sm md:text-base font-bold whitespace-nowrap transition-colors select-none
                    ${
                      filter === tab.id
                        ? "text-[#0077BE]"
                        : "text-gray-500 hover:text-gray-800"
                    }
                  `}
                >
                  {tab.label}
                  {/* Active Indicator: Absolute positioning needs padding in parent to not be clipped */}
                  {filter === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0077BE] rounded-t-full shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 px-2 pb-10">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`
                group bg-white border border-gray-200 rounded-2xl 
                p-5 md:p-6 
                shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 
                transition-all duration-300 ease-out
                flex flex-col h-full relative isolate
                ${!quiz.isAvailable ? "opacity-75 grayscale-[0.3] hover:translate-y-0 hover:shadow-none" : ""}
              `}
            >
              <div className="flex justify-between items-start gap-3 mb-4">
                <span
                  className={`px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wide rounded-full ${
                    quiz.status === "upcoming"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {quiz.category}
                </span>
                <span
                  className={`px-2.5 py-1 text-[10px] md:text-[11px] font-bold rounded-full border ${
                    quiz.status === "open"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}
                >
                  {quiz.statusLabel}
                </span>
              </div>

              <h3
                className="text-gray-900 text-lg font-bold mb-4 leading-snug line-clamp-2 min-h-14"
                title={quiz.title}
              >
                {quiz.title}
              </h3>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MdAccessTime className="text-lg text-gray-400 shrink-0" />
                  <span className="truncate">
                    Thời gian:{" "}
                    <span className="font-semibold text-gray-700">
                      {quiz.duration}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MdFormatListBulleted className="text-lg text-gray-400 shrink-0" />
                  <span className="truncate">
                    Số câu hỏi:{" "}
                    <span className="font-semibold text-gray-700">
                      {quiz.questions}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  {quiz.status === "upcoming" ? (
                    <>
                      <MdEvent className="text-lg text-gray-400 shrink-0" />
                      <span className="truncate">
                        Bắt đầu:{" "}
                        <span className="font-semibold text-gray-700">
                          {quiz.startDate}
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <MdEventBusy className="text-lg text-gray-400 shrink-0" />
                      <span className="truncate">
                        Hạn chót:{" "}
                        <span className="font-semibold text-gray-700">
                          {quiz.deadline}
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                disabled={!quiz.isAvailable}
                onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                className={`
                  w-full py-3 rounded-xl font-bold text-sm
                  flex items-center justify-center gap-2 transition-all
                  ${
                    quiz.isAvailable
                      ? "color-primary-bg text-white hover:opacity-80 hover:cursor-pointer shadow-md shadow-blue-500/20 active:scale-[0.98]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {quiz.isAvailable ? (
                  <>
                    <span>Làm bài ngay</span>
                    <MdArrowForward className="text-lg" />
                  </>
                ) : (
                  <span>Chưa mở</span>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <MdQuiz className="text-5xl text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Không tìm thấy bài thi nào
          </h3>
          <p className="text-gray-500 mt-2 text-sm max-w-xs">
            Thử thay đổi bộ lọc hoặc quay lại sau.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAvailableQuizzesPage;
