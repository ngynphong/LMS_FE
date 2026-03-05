import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { useLiveQuizState } from "@/hooks/useLiveQuiz";
import { WifiOff, Hourglass, Gamepad2 } from "lucide-react";

const LiveQuizLobbyPage = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState<string>("");
  const [, setPlayerId] = useState<string>("");

  // Fetch initial state just in case we reconnected
  const stateQuery = useLiveQuizState(pin, true);

  // WebSocket Logic
  const { isConnected, lastPlayerEvent } = useLiveQuizSocket(
    pin || null,
    "PLAYER",
  );

  useEffect(() => {
    const storedName = localStorage.getItem("live_quiz_player_name");
    const storedId = localStorage.getItem("live_quiz_player_id");
    const storedPin = localStorage.getItem("live_quiz_pin");

    if (!storedId || storedPin !== pin) {
      navigate("/student/live-quiz/join");
      return;
    }

    setPlayerName(storedName || "Người chơi ảo");
    setPlayerId(storedId);
  }, [navigate, pin]);

  // Handle incoming events specifically starting the game
  useEffect(() => {
    if (!lastPlayerEvent) return;

    if (
      lastPlayerEvent.type === "START_GAME" ||
      stateQuery.data?.state === "IN_PROGRESS"
    ) {
      navigate(`/student/live-quiz/play/${pin}`);
    }
  }, [lastPlayerEvent, navigate, pin, stateQuery.data?.state]);

  return (
    <div className="min-h-screen bg-[#1E90FF] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0057b3]/40 blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="z-10 text-center max-w-lg w-full flex flex-col items-center">
        {isConnected ? (
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
            Đã kết nối máy chủ
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-red-500/80 text-white px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-red-400/50 shadow-lg">
            <WifiOff className="w-4 h-4" />
            Đang kết nối...
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[2rem] w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
          <div className="absolute -inset-2 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine"></div>

          <h2 className="text-2xl font-bold text-white/90 mb-2 tracking-tight">
            Xin chào,
          </h2>
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-white drop-shadow-lg tracking-tight">
            {playerName}
          </h1>

          <div className="relative w-28 h-28 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30 shadow-xl group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>
            <Hourglass className="w-12 h-12 text-white animate-pulse" />
          </div>

          <div className="bg-white text-[#1E90FF] py-4 px-8 rounded-2xl inline-flex flex-col items-center shadow-xl">
            <span className="font-bold text-lg mb-1">Bạn đã vào phòng!</span>
            <span className="text-sm font-semibold opacity-80">
              Hãy nhìn lên màn hình của giáo viên
            </span>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3 text-white/90 font-medium bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
          <Gamepad2 className="w-5 h-5" />
          <span>Mã PIN:</span>
          <span className="text-white font-black font-mono text-xl tracking-widest">
            {pin}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizLobbyPage;
