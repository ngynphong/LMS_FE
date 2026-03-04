import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuizSocket } from "@/hooks/useLiveQuizSocket";
import { useLiveQuizState } from "@/hooks/useLiveQuiz";

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
    <div className="min-h-screen bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-48 h-48 bg-purple-900/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="z-10 text-center max-w-lg w-full flex flex-col items-center">
        {isConnected ? (
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-green-400/30">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
            Đã kết nối máy chủ
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-100 px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-md border border-red-400/30">
            <span className="material-symbols-outlined text-sm">wifi_off</span>
            Đang kết nối...
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full shadow-2xl relative overflow-hidden group">
          <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine"></div>

          <h2 className="text-2xl font-bold text-white/90 mb-2">Xin chào,</h2>
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
            {playerName}
          </h1>

          <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <span className="material-symbols-outlined text-5xl">
              hourglass_empty
            </span>
          </div>

          <p className="text-xl font-bold bg-white text-purple-600 py-3 px-6 rounded-xl inline-block shadow-lg">
            Hãy nhìn lên màn hình chính!
          </p>
          <p className="text-white/80 mt-4 text-sm font-medium">
            Trò chơi sẽ bắt đầu trong giây lát...
          </p>
        </div>

        <div className="mt-12 flex items-center gap-2 text-white/60 font-medium bg-black/10 px-4 py-2 rounded-lg">
          <span>Mã phòng:</span>
          <span className="text-white font-bold font-mono text-lg tracking-widest">
            {pin}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizLobbyPage;
