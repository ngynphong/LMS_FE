import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizResults } from "@/hooks/useLiveQuiz";
import { LiveLeaderboard } from "@/components/live-quiz/LiveLeaderboard";

const LiveQuizHostResultPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  // Fetch final results from API
  // This assumes backend handles saving results when /finish is called
  const { data: results, isLoading, error } = useLiveQuizResults(pin);

  useEffect(() => {
    if (error) {
      navigate("/teacher/quizzes");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-white rounded-full animate-spin mb-4"></div>
        <h2 className="text-white text-xl font-bold">Đang tải bảng vàng...</h2>
      </div>
    );
  }

  const leaderboardData = (results || []).map((r) => ({
    rank: r.rankPosition,
    studentId: r.playerId,
    studentName: r.playerName,
    score: r.totalScore,
  }));

  // Find the top 3 separate from the rest to highlight them
  const top3 = [...leaderboardData].sort((a, b) => a.rank - b.rank).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Confetti / Effects layer (Static for now, can add JS confetti) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('/img/confetti-bg.png')] bg-cover bg-center mix-blend-screen"></div>

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center z-10 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-200 drop-shadow-md p-1">
          Tổng Kết Trận Đấu
        </h1>
        <button
          onClick={() => navigate("/teacher/quizzes")}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-xl font-bold transition-all"
        >
          Đóng Phòng
        </button>
      </div>

      {/* Top 3 Podium Display */}
      <div className="w-full max-w-4xl flex items-end justify-center gap-2 md:gap-6 mb-12 z-10 mt-8">
        {/* 2nd Place */}
        {top3[1] && (
          <div
            className="flex flex-col items-center w-1/3 max-w-[200px] animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-300 border-4 border-slate-400 flex items-center justify-center shadow-lg relative mb-4 z-10">
              <span className="text-3xl md:text-5xl filter drop-shadow-sm">
                🥈
              </span>
              <div className="absolute -bottom-3 bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                {top3[1].studentName}
              </div>
            </div>
            <div className="w-full bg-linear-to-t from-slate-400 to-slate-300 h-24 md:h-32 rounded-t-lg shadow-2xl flex flex-col items-center justify-start pt-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%] animate-shine"></div>
              <span className="text-slate-700 font-black text-xl md:text-2xl">
                {Math.round(top3[1].score)}
              </span>
              <span className="text-slate-600 text-xs font-bold">điểm</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div
            className="flex flex-col items-center w-1/3 max-w-[220px] animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="absolute -top-12 animate-bounce">
              <span className="text-5xl filter drop-shadow-lg">👑</span>
            </div>
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-yellow-400 border-4 border-yellow-200 flex items-center justify-center shadow-xl relative mb-4 z-10">
              <span className="text-4xl md:text-6xl filter drop-shadow-sm">
                🥇
              </span>
              <div className="absolute -bottom-4 bg-yellow-600 text-white text-sm md:text-base font-bold px-4 py-1.5 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] shadow-md border border-yellow-300">
                {top3[0].studentName}
              </div>
            </div>
            <div className="w-full bg-linear-to-t from-yellow-500 to-yellow-300 h-32 md:h-48 rounded-t-lg shadow-2xl flex flex-col items-center justify-start pt-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-150%] animate-shine delay-500"></div>
              <span className="text-yellow-900 font-black text-2xl md:text-4xl drop-shadow-sm">
                {Math.round(top3[0].score)}
              </span>
              <span className="text-yellow-800 text-sm font-bold mt-1">
                điểm
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div
            className="flex flex-col items-center w-1/3 max-w-[180px] animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-orange-300 border-4 border-orange-400 flex items-center justify-center shadow-lg relative mb-4 z-10">
              <span className="text-2xl md:text-4xl filter drop-shadow-sm">
                🥉
              </span>
              <div className="absolute -bottom-3 bg-orange-700 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                {top3[2].studentName}
              </div>
            </div>
            <div className="w-full bg-linear-to-t from-orange-400 to-orange-300 h-16 md:h-24 rounded-t-lg shadow-2xl flex flex-col items-center justify-start pt-3 relative overflow-hidden">
              <span className="text-orange-900 font-black text-lg md:text-xl">
                {Math.round(top3[2].score)}
              </span>
              <span className="text-orange-800 text-[10px] font-bold">
                điểm
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="w-full max-w-3xl z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-400">
            format_list_numbered
          </span>
          Bảng Xếp Hạng Tổng
        </h3>

        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <LiveLeaderboard leaderboard={leaderboardData} />
        </div>
      </div>
    </div>
  );
};

export default LiveQuizHostResultPage;
