import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useCheckPinInfo, useJoinLiveQuiz } from "@/hooks/useLiveQuiz";
import { toast } from "@/components/common/Toast";

const joinSchema = z.object({
  pin: z.string().min(1, "Vui lòng nhập mã PIN"),
  studentName: z.string().min(1, "Vui lòng nhập tên hiển thị"),
});

type JoinFormData = z.infer<typeof joinSchema>;

const LiveQuizJoinPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1); // 1: Enter PIN, 2: Enter Name

  const checkPin = useCheckPinInfo();
  const joinQuiz = useJoinLiveQuiz();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JoinFormData>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      pin: "",
      studentName: user ? `${user.firstName} ${user.lastName}` : "",
    },
  });

  const pinValue = watch("pin");

  const handleCheckPin = async () => {
    if (!pinValue) {
      toast.error("Vui lòng nhập mã PIN");
      return;
    }
    try {
      const res = await checkPin.mutateAsync(pinValue);
      if (res.valid) {
        setStep(2);
      } else {
        toast.error("Mã PIN không hợp lệ hoặc phòng đã đóng.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi kiểm tra mã PIN");
    }
  };

  const onSubmitName = async (data: JoinFormData) => {
    try {
      const res = await joinQuiz.mutateAsync({
        pin: data.pin,
        studentName: data.studentName,
      });

      // Store playerId in localStorage exactly as API doc dictates
      localStorage.setItem("live_quiz_player_id", res.playerId);
      localStorage.setItem("live_quiz_player_name", res.studentName);
      localStorage.setItem("live_quiz_pin", res.pin);

      navigate(`/student/live-quiz/lobby/${res.pin}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể tham gia phòng chơi",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      {/* Header / Logo Area */}
      <div className="text-center mb-8 animate-bounce-slow">
        <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg tracking-tight">
          CodeQuiz <span className="text-yellow-300">Live!</span>
        </h1>
        <p className="text-white/80 font-medium mt-2 text-lg">
          Tham gia trận chiến tri thức thời gian thực
        </p>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 transform transition-all">
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">
                  dialpad
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Nhập mã Game</h2>
            </div>

            <div className="flex flex-col gap-2">
              <input
                {...register("pin")}
                type="text"
                placeholder="PIN Code"
                className="w-full text-center text-3xl font-black p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-colors"
                maxLength={6}
                onKeyDown={(e) => e.key === "Enter" && handleCheckPin()}
              />
              {errors.pin && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {errors.pin.message}
                </p>
              )}
            </div>

            <button
              onClick={handleCheckPin}
              disabled={checkPin.isPending || !pinValue}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold text-lg p-4 rounded-xl transition-all shadow-md active:scale-95"
            >
              {checkPin.isPending ? "Đang kiểm tra..." : "Nhập PIN"}
            </button>
          </div>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmitName)}
            className="flex flex-col gap-5 animate-fade-in-up"
          >
            <div className="text-center mb-2">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 scale-in-center">
                <span className="material-symbols-outlined text-3xl">
                  smart_toy
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Bạn là ai?</h2>
            </div>

            <div className="flex flex-col gap-2">
              <input
                {...register("studentName")}
                type="text"
                placeholder="Tên hiển thị của bạn"
                className="w-full text-center text-xl font-bold p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 outline-none transition-colors"
              />
              {errors.studentName && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {errors.studentName.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={joinQuiz.isPending}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold text-lg p-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              {joinQuiz.isPending ? (
                "Đang vào phòng..."
              ) : (
                <>
                  Vào Game{" "}
                  <span className="material-symbols-outlined text-xl">
                    rocket_launch
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full bg-transparent text-gray-500 hover:text-gray-700 font-bold text-sm p-2 transition-all"
            >
              Quay lại
            </button>
          </form>
        )}
      </div>

      {/* Footer styling note */}
      <div className="mt-12 text-white/60 text-sm font-medium">
        Sản phẩm của LMS System © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default LiveQuizJoinPage;
