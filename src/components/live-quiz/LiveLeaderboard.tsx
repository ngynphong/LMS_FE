import { useMemo } from "react";
import type { LiveQuizLeaderboardItem } from "@/types/live-quiz";
import { Trophy } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Trophy className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">Chưa có dữ liệu bảng xếp hạng</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {sortedLeaderboard.map((player, index) => {
        const isMe = highlightStudentId === player.studentId;
        const isTop1 = index === 0;
        const isTop2 = index === 1;
        const isTop3 = index === 2;

        return (
          <div
            key={player.studentId}
            className={`
              relative flex items-center p-5 rounded-2xl shadow-sm border
              transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md
              ${isMe ? "bg-blue-50/50 border-[#1E90FF]/30 ring-2 ring-[#1E90FF]/20 scale-[1.02]" : "bg-white border-slate-100"}
              ${isTop1 && !isMe ? "bg-yellow-50/30 border-yellow-200/50" : ""}
            `}
          >
            {/* Rank Badge */}
            <div className="w-14 h-14 shrink-0 flex items-center justify-center font-bold text-lg relative">
              {isTop1 ? (
                <>
                  <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full"></div>
                  <span className="text-4xl filter drop-shadow hover:scale-110 transition-transform">
                    👑
                  </span>
                </>
              ) : isTop2 ? (
                <span className="text-3xl filter drop-shadow grayscale-20">
                  🥈
                </span>
              ) : isTop3 ? (
                <span className="text-3xl filter drop-shadow sepia-40">🥉</span>
              ) : (
                <span className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl text-base font-black">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 ml-5 min-w-0 flex items-center gap-3">
              <h3
                className={`font-black text-xl truncate tracking-tight ${isMe ? "text-[#1E90FF]" : "text-white"}`}
              >
                {player.studentName}
              </h3>
              {isMe && (
                <span className="shrink-0 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#1E90FF] text-white shadow-sm shadow-[#1E90FF]/20">
                  Bạn
                </span>
              )}
            </div>

            {/* Score */}
            <div className="ml-4 text-right">
              <p className="font-mono text-2xl font-black text-white tracking-tighter">
                {Math.round(player.score).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                điểm
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
