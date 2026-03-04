import { useMemo } from "react";
import type { LiveQuizLeaderboardItem } from "@/types/live-quiz";

interface LiveLeaderboardProps {
  leaderboard: LiveQuizLeaderboardItem[];
  highlightStudentId?: string | null;
}

export const LiveLeaderboard = ({
  leaderboard,
  highlightStudentId,
}: LiveLeaderboardProps) => {
  // Sort just in case it's not sorted securely from backend
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => b.score - a.score);
  }, [leaderboard]);

  if (sortedLeaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <span className="material-symbols-outlined text-5xl mb-4 opacity-50">
          leaderboard
        </span>
        <p>Chưa có dữ liệu bảng xếp hạng</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      {sortedLeaderboard.map((player, index) => {
        const isMe = highlightStudentId === player.studentId;
        const isTop1 = index === 0;
        const isTop2 = index === 1;
        const isTop3 = index === 2;

        return (
          <div
            key={player.studentId}
            className={`
                            relative flex items-center p-4 rounded-xl shadow-sm border
                            transform transition-all duration-500 ease-out hover:-translate-y-1
                            ${isMe ? "bg-blue-50 border-blue-400 ring-2 ring-blue-400/50 scale-[1.02]" : "bg-white border-gray-100"}
                        `}
          >
            {/* Rank Badge */}
            <div className="w-12 h-12 shrink-0 flex items-center justify-center font-bold text-lg">
              {isTop1 ? (
                <span className="text-3xl filter drop-shadow-md">🥇</span>
              ) : isTop2 ? (
                <span className="text-3xl filter drop-shadow-md">🥈</span>
              ) : isTop3 ? (
                <span className="text-3xl filter drop-shadow-md">🥉</span>
              ) : (
                <span className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full text-sm font-bold">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 ml-4 min-w-0 flex items-center gap-3">
              <h3
                className={`font-bold text-lg truncate ${isMe ? "text-blue-900" : "text-gray-800"}`}
              >
                {player.studentName}
              </h3>
              {isMe && (
                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                  Bạn
                </span>
              )}
            </div>

            {/* Score */}
            <div className="ml-4 text-right">
              <p className="font-mono text-xl font-bold text-gray-900 tracking-tight">
                {Math.round(player.score).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-medium">điểm</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
