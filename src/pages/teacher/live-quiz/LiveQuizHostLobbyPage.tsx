import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { useLiveQuizDetails, useStartLiveQuiz } from "@/hooks/useLiveQuiz";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/common/Toast";
import { useQuizSounds } from "@/hooks/useQuizSounds";
import SoundToggleButton from "@/components/live-quiz/SoundToggleButton";

const LiveQuizHostLobbyPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const { data: quizDetails, isLoading, error } = useLiveQuizDetails(pin);
  const startQuizMutation = useStartLiveQuiz();

  const { isConnected, playersList } = useLiveQuizSocket(pin || null, "HOST");

  // Sound effects
  const {
    isMuted,
    toggleMute,
    playLobbyMusic,
    stopLobbyMusic,
    playPlayerJoin,
    playStartGame,
  } = useQuizSounds();

  const prevPlayerCount = useRef(0);

  // Bật/tắt nhạc nền lobby theo trạng thái mute
  useEffect(() => {
    if (isMuted) {
      stopLobbyMusic();
    } else {
      playLobbyMusic();
    }
    return () => stopLobbyMusic();
  }, [isMuted, playLobbyMusic, stopLobbyMusic]);

  // Phát âm thanh khi có player mới join
  useEffect(() => {
    if (playersList.length > prevPlayerCount.current) {
      playPlayerJoin();
    }
    prevPlayerCount.current = playersList.length;
  }, [playersList.length, playPlayerJoin]);

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
      playStartGame();
      stopLobbyMusic();
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Top Config Bar */}
      <div className="w-full bg-white border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-10 sticky top-0">
        <div className="flex flex-col text-slate-800">
          <h1 className="text-xl font-bold">
            {quizDetails?.title || "Đang tải..."}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[1rem]">
                quiz
              </span>
              {quizDetails?.questions.length || 0} câu hỏi
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[1rem]">
                group
              </span>
              {playersList.length} người chờ
            </span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <SoundToggleButton isMuted={isMuted} onToggle={toggleMute} />
          <button
            onClick={() => {
              stopLobbyMusic();
              navigate("/teacher/quizzes");
            }}
            className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleStartGame}
            disabled={startQuizMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-[#1E90FF] hover:bg-blue-600 text-white font-black shadow-lg
             shadow-[#1E90FF]/30 transition-all active:translate-y-0 hover:-translate-y-1 disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
          >
            {startQuizMutation.isPending ? "Đang bắt đầu..." : "BẮT ĐẦU GAME"}
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="w-full flex-1 flex flex-col md:flex-row max-w-7xl relative mx-auto p-4 md:p-8 gap-8 items-stretch pt-12">
        {/* Left Side: PIN Info */}
        <div className="w-full md:w-1/2 flex flex-col animate-fade-in-up">
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-[0_10px_40px_-15px_rgba(30,144,255,0.2)] border border-slate-100 relative w-full text-center overflow-hidden flex-1 flex flex-col justify-center items-center">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#1E90FF]"></div>

            <p className="text-slate-500 font-bold text-xl mb-2">
              Truy cập trình duyệt để thi:
            </p>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
              <QRCodeSVG
                value={`https://iesfocus.edu.vn/join?pin=${pin}`}
                size={220}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <p className="text-2xl md:text-3xl font-black text-slate-800 mb-8 pb-8 tracking-tight">
              iesfocus.edu.vn/join
            </p>

            <div className="bg-slate-50 w-full rounded-2xl p-8 border border-slate-100">
              <p className="text-slate-500 font-bold text-lg mb-2 uppercase tracking-widest">
                Mã phòng thi
              </p>
              <h2 className="text-6xl md:text-8xl font-black text-[#1E90FF] tracking-widest drop-shadow-sm select-all">
                {pin}
              </h2>
            </div>

            {!isConnected && (
              <div className="mt-8 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 py-2 px-4 rounded-xl border border-red-100 w-full">
                <span className="material-symbols-outlined">wifi_off</span>
                Mất kết nối tới máy chủ Live!
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Players List */}
        <div
          className="w-full md:w-1/2 flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-[#1E90FF]/10 text-[#1E90FF] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">groups</span>
              </div>
              Người chơi
            </h3>
            <div className="bg-[#1E90FF] text-white font-black text-lg py-1 px-5 rounded-full shadow-md shadow-[#1E90FF]/20">
              {playersList.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[350px] custom-scrollbar pr-3">
            {playersList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 border-4 border-slate-200 border-t-[#1E90FF] rounded-full animate-spin mb-4 shadow-sm"></div>
                <p className="text-lg font-medium">
                  Đang chờ người chơi tham gia...
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 content-start pb-4">
                {playersList.map((player) => (
                  <div
                    key={player.studentId}
                    className="shrink-0 bg-white border-2 border-slate-100 hover:border-[#1E90FF]/50 hover:bg-[#1E90FF]/5 text-slate-700 px-5 py-3 rounded-2xl text-lg font-bold shadow-sm animate-scale-in flex items-center gap-3 transition-colors cursor-default"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    {player.studentName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-slate-400 text-sm font-medium pb-6 pt-4">
        Powered by IES Focus
      </div>
    </div>
  );
};

export default LiveQuizHostLobbyPage;
