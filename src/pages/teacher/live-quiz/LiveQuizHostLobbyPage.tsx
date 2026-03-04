import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { useLiveQuizDetails, useStartLiveQuiz } from "@/hooks/useLiveQuiz";
import { toast } from "@/components/common/Toast";

const LiveQuizHostLobbyPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const { data: quizDetails, isLoading, error } = useLiveQuizDetails(pin);
  const startQuizMutation = useStartLiveQuiz();

  const { isConnected, playersList } = useLiveQuizSocket(pin || null, "HOST");

  useEffect(() => {
    if (error) {
      toast.error("Không thể lấy thông tin phòng chơi");
      navigate("/teacher/quizzes");
    }
  }, [error, navigate]);

  const handleStartGame = async () => {
    if (!pin) return;
    if (playersList.length === 0) {
      if (
        !window.confirm(
          "Chưa có học sinh nào tham gia, bạn có chắc chắn muốn bắt đầu?",
        )
      ) {
        return;
      }
    }

    try {
      await startQuizMutation.mutateAsync(pin);
      navigate(`/teacher/live-quiz/play/${pin}`);
    } catch (error) {
      toast.error("Không thể bắt đầu trò chơi");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center">
      {/* Top Config Bar */}
      <div className="w-full bg-slate-800 p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex flex-col text-white">
          <h1 className="text-xl font-bold">
            {quizDetails?.title || "Đang tải..."}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">quiz</span>
              {quizDetails?.questions.length || 0} câu hỏi
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">group</span>
              {playersList.length} người chờ
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/teacher/quizzes")}
            className="px-6 py-2.5 rounded-lg text-slate-300 font-bold hover:bg-slate-700 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleStartGame}
            disabled={startQuizMutation.isPending}
            className="px-6 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-white font-black shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:bg-slate-600 disabled:shadow-none"
          >
            {startQuizMutation.isPending ? "Đang bắt đầu..." : "BẮT ĐẦU GAME"}
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="w-full flex-1 flex flex-col md:flex-row max-w-7xl relative mx-auto p-4 md:p-8 gap-8">
        {/* Left Side: PIN Info */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center animate-fade-in-up">
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl relative w-full text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 to-purple-500"></div>

            <p className="text-gray-500 font-bold text-xl mb-2">
              Truy cập để tham gia:
            </p>
            <p className="text-3xl md:text-5xl font-black text-gray-800 mb-8 border-b-2 border-gray-100 pb-8 tracking-tight">
              www.codedy.vn
            </p>

            <p className="text-gray-500 font-bold text-xl mb-4">
              Mã số Game (PIN)
            </p>
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-purple-600 tracking-widest drop-shadow-sm select-all">
              {pin}
            </h2>

            {!isConnected && (
              <div className="mt-8 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 py-2 px-4 rounded-xl">
                <span className="material-symbols-outlined">wifi_off</span>
                Mất kết nối tới máy chủ Live!
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Players List */}
        <div
          className="w-full md:w-1/2 flex flex-col h-full bg-slate-800/50 rounded-3xl border border-slate-700 p-6 overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400">
                groups
              </span>
              Người chơi
            </h3>
            <div className="bg-slate-800 text-white font-bold py-1 px-4 rounded-full border border-slate-600">
              {playersList.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[300px] custom-scrollbar pr-2">
            {playersList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <div className="w-20 h-20 border-4 border-slate-700 border-t-slate-500 rounded-full animate-spin-slow mb-4"></div>
                <p className="text-lg font-medium">Đang chờ người chơi...</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {playersList.map((player) => (
                  <div
                    key={player.studentId}
                    className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 px-4 py-2.5 rounded-xl text-lg font-bold shadow-sm animate-scale-in flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    {player.studentName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-slate-500 text-sm pb-4">Powered by LMS System</div>
    </div>
  );
};

export default LiveQuizHostLobbyPage;
