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

const StudentAvailableQuizzesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const quizzes = [
    {
      id: 1,
      category: "Lập trình Web",
      status: "open", // open, upcoming, closed
      statusLabel: "Đang mở",
      title: "Kiểm tra giữa kỳ - ReactJS",
      duration: "45 phút",
      questions: 30,
      deadline: "20/10/2023",
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
      deadline: "25/10/2023",
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
      startDate: "01/11/2023",
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#111827] text-3xl font-black leading-tight tracking-[-0.033em]">
          Bài thi & Quiz khả dụng
        </h1>
        <p className="text-gray-600 text-base font-normal">
          Hoàn thành các bài kiểm tra để đánh giá năng lực của bạn.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        {[
          { id: "all", label: "Tất cả" },
          { id: "upcoming", label: "Sắp diễn ra" },
          { id: "open", label: "Đang diễn ra" },
          { id: "closed", label: "Đã kết thúc" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
              filter === tab.id
                ? "color-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full ${
                !quiz.isAvailable ? "opacity-80 grayscale-[0.5]" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 text-[11px] font-bold uppercase rounded-full ${quiz.status === "upcoming" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"}`}
                >
                  {quiz.category}
                </span>
                <span
                  className={`px-3 py-1 text-[11px] font-bold rounded-full ${
                    quiz.status === "open"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {quiz.statusLabel}
                </span>
              </div>
              <h3 className="text-[#111827] text-xl font-bold mb-5 leading-tight">
                {quiz.title}
              </h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <MdAccessTime className="text-lg" />
                  <span className="text-sm">Thời gian: {quiz.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MdFormatListBulleted className="text-lg" />
                  <span className="text-sm">Số câu hỏi: {quiz.questions}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  {quiz.status === "upcoming" ? (
                    <>
                      <MdEvent className="text-lg" />
                      <span className="text-sm font-medium">
                        Bắt đầu: {quiz.startDate}
                      </span>
                    </>
                  ) : (
                    <>
                      <MdEventBusy className="text-lg" />
                      <span className="text-sm font-medium">
                        Hạn chót: {quiz.deadline}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                disabled={!quiz.isAvailable}
                onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                className={`mt-auto w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  quiz.isAvailable
                    ? "bg-[#0077BE] text-white hover:bg-blue-600 shadow-lg shadow-blue-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {quiz.isAvailable ? (
                  <>
                    <span>Bắt đầu làm bài</span>
                    <MdArrowForward className="text-lg" />
                  </>
                ) : (
                  <span>Chưa thể bắt đầu</span>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-gray-50 p-8 rounded-full mb-6">
            <MdQuiz className="text-6xl text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-[#111827]">
            Hiện tại không có bài thi nào
          </h3>
          <p className="text-gray-500 mt-2">
            Vui lòng quay lại sau hoặc kiểm tra lịch học của bạn.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAvailableQuizzesPage;
