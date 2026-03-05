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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl text-center mb-8 animate-fade-in-down">
        {isGameEnded ? (
          <>
            <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-5xl">
                rewarded_ads
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Trận Chiến Kết Thúc!
            </h1>
            <p className="text-lg text-gray-500">
              Cảm ơn bạn đã tham gia khóa học hôm nay.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-5xl">
                bar_chart
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Xếp Hạng Tạm Thời
            </h1>
            <p className="text-lg text-gray-500">
              Chuẩn bị cho câu hỏi tiếp theo...
            </p>
          </>
        )}
      </div>

      {/* My Score Card */}
      {myRank && (
        <div className="w-full max-w-3xl bg-indigo-600 rounded-2xl p-6 text-white mb-8 shadow-xl flex items-center justify-between animate-fade-in">
          <div>
            <p className="text-indigo-200 font-medium mb-1">Điểm của bạn</p>
            <p className="text-4xl font-black tracking-tight">
              {Math.round(myRank.score)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-indigo-200 font-medium mb-1">Vị trí xếp hạng</p>
            <p className="text-4xl font-black tracking-tight flex items-center gap-1 justify-end">
              <span className="text-2xl opacity-80">#</span>
              {myRank.rank}
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Component */}
      <div
        className="w-full max-w-3xl animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {isGameEnded &&
        resultsQuery.isLoading &&
        displayLeaderboard.length === 0 ? (
          <div className="text-center py-10">Đang tải kết quả...</div>
        ) : (
          <LiveLeaderboard
            leaderboard={displayLeaderboard}
            highlightStudentId={playerId}
          />
        )}
      </div>

      {isGameEnded && (
        <div className="mt-12 w-full max-w-3xl text-center">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Trở về trang chủ
          </button>
          <p className="text-gray-400 text-sm mt-4 font-medium">
            Bảng xếp hạng sẽ được lưu vào lịch sử bài thi của bạn.
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveQuizResultPage;
