import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { LiveLeaderboard } from "@/components/live-quiz/LiveLeaderboard";
import { useLiveQuizResults } from "@/hooks/useLiveQuiz";
import type { LiveQuizLeaderboardItem } from "@/types/live-quiz";
import { Trophy, Medal } from "lucide-react";

const LiveQuizResultPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const routerLeaderboard: LiveQuizLeaderboardItem[] =
    (location.state as any)?.leaderboard || [];

  // Check if the game is completely finished via URL param
  const isGameEnded = searchParams.get("ended") === "true";

  const [playerId, setPlayerId] = useState<string>("");

  // If game ended, fetch final results.
  // If not ended (just in between questions), poll every 3 seconds to recover from missed WebSocket events.
  const resultsQuery = useLiveQuizResults(pin, isGameEnded ? false : 3000);

  const { lastPlayerEvent, leaderboard } = useLiveQuizSocket(
    // Only connect socket if game hasn't ended completely
    isGameEnded ? null : pin || null,
    "PLAYER",
  );

  useEffect(() => {
    const storedId = localStorage.getItem("live_quiz_player_id");
    if (!storedId) {
      navigate("/student/live-quiz/join");
      return;
    }
    setPlayerId(storedId);
  }, [navigate]);

  // Handle incoming events if game hasn't ended
  useEffect(() => {
    if (isGameEnded || !lastPlayerEvent) return;

    // If teacher moves to next question, redirect back to play page
    if (lastPlayerEvent.type === "NEXT_QUESTION") {
      navigate(`/student/live-quiz/play/${pin}`, {
        state: { initialQuestion: lastPlayerEvent.data },
      });
    } else if (lastPlayerEvent.type === "FINISH_GAME") {
      navigate(`/student/live-quiz/result/${pin}?ended=true`, {
        replace: true,
      });
    }
  }, [lastPlayerEvent, navigate, pin, isGameEnded]);

  // Format data depending on source
  let displayLeaderboard: LiveQuizLeaderboardItem[] = [];
  if (resultsQuery.data && resultsQuery.data.length > 0) {
    displayLeaderboard = resultsQuery.data.map((r) => ({
      rank: r.rankPosition,
      studentId: r.playerId,
      studentName: r.playerName,
      score: r.totalScore,
    }));
  } else {
    displayLeaderboard =
      leaderboard.length > 0 ? leaderboard : routerLeaderboard;
  }

  // Find my position
  const myRank = displayLeaderboard.find((p) => p.studentId === playerId);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#1E90FF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#1E90FF]/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-3xl text-center mb-10 animate-fade-in-down z-10 mt-8">
        {isGameEnded ? (
          <>
            <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/20 rotate-12 shrink-0">
              <Trophy className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">
              Trận Chiến Kết Thúc!
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Cảm ơn bạn đã tham gia khóa học hôm nay.
            </p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-[#1E90FF]/10 text-[#1E90FF] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#1E90FF]/10 rotate-12 shrink-0">
              <Medal className="w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight">
              Xếp Hạng Tạm Thời
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Chuẩn bị cho câu hỏi tiếp theo...
            </p>
          </>
        )}
      </div>

      {/* My Score Card */}
      {myRank && (
        <div className="w-full max-w-3xl bg-[#1E90FF] rounded-[2rem] p-8 text-white mb-10 shadow-2xl shadow-[#1E90FF]/30 flex items-center justify-between relative overflow-hidden z-10 animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10">
            <p className="text-blue-100 font-bold mb-1 uppercase tracking-wider text-sm">
              Điểm của bạn
            </p>
            <p className="text-5xl font-black tracking-tight drop-shadow-md">
              {Math.round(myRank.score)}
            </p>
          </div>
          <div className="text-right relative z-10">
            <p className="text-blue-100 font-bold mb-1 uppercase tracking-wider text-sm">
              Vị trí xếp hạng
            </p>
            <p className="text-5xl font-black tracking-tight flex items-center gap-1 justify-end drop-shadow-md">
              <span className="text-3xl opacity-80 font-normal">#</span>
              {myRank.rank}
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Component */}
      <div
        className="w-full max-w-3xl z-10 relative animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {isGameEnded &&
        resultsQuery.isLoading &&
        displayLeaderboard.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Đang tải kết quả...
          </div>
        ) : (
          <LiveLeaderboard
            leaderboard={displayLeaderboard}
            highlightStudentId={playerId}
          />
        )}
      </div>

      {isGameEnded && (
        <div className="mt-12 w-full max-w-3xl text-center z-10 relative">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white
             font-bold text-lg py-4 px-10 rounded-2xl shadow-xl transition-all active:translate-y-0 hover:-translate-y-1 cursor-pointer"
          >
            Trở về trang chủ
          </button>
          <p className="text-slate-400 text-sm mt-5 font-medium">
            Bảng xếp hạng sẽ được lưu vào lịch sử bài thi của bạn.
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveQuizResultPage;
