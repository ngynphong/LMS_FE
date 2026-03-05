import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useCheckPinInfo, useJoinLiveQuiz } from "@/hooks/useLiveQuiz";
import { toast } from "@/components/common/Toast";
import { Gamepad2, User, Sparkles, LogIn, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1E90FF]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#1E90FF]/5 blur-[120px]" />
      </div>

      <div className="z-10 w-full flex flex-col items-center">
        {/* Header / Logo Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="w-14 h-14 bg-[#1E90FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1E90FF]/40 rotate-12">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight">
              Quiz<span className="text-[#1E90FF]">Live</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Tham gia phòng học thời gian thực
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(30,144,255,0.2)] border border-white/50 p-8">
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-[#1E90FF] rounded-full flex items-center justify-center mx-auto mb-4 scale-in-center">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Nhập mã Game
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  {...register("pin")}
                  type="text"
                  placeholder="PIN CODE"
                  className="w-full text-center text-4xl font-black tracking-widest p-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#1E90FF] focus:bg-white focus:ring-4 focus:ring-[#1E90FF]/20 outline-none transition-all placeholder:text-slate-300 text-slate-700 uppercase"
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
                className="w-full group relative flex items-center justify-center gap-2 bg-[#1E90FF] hover:bg-blue-600
                 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg p-4
                  rounded-2xl transition-all duration-300 shadow-lg shadow-[#1E90FF]/30 hover:shadow-[#1E90FF]/50 
                  hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                {checkPin.isPending ? "Đang kiểm tra..." : "Xác nhận"}
                {!checkPin.isPending && (
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <form
              onSubmit={handleSubmit(onSubmitName)}
              className="flex flex-col gap-6 animate-fade-in-up"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-[#1E90FF] rounded-full flex items-center justify-center mx-auto mb-4 scale-in-center">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Bạn là ai?
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  {...register("studentName")}
                  type="text"
                  placeholder="Tên hiển thị của bạn"
                  className="w-full text-center text-xl font-bold p-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#1E90FF] focus:bg-white focus:ring-4 focus:ring-[#1E90FF]/20 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                />
                {errors.studentName && (
                  <p className="text-red-500 text-sm font-medium text-center">
                    {errors.studentName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={joinQuiz.isPending}
                  className="w-full group flex items-center justify-center gap-2 bg-[#1E90FF] hover:bg-blue-600 disabled:bg-slate-300
                   text-white font-bold text-lg p-4 rounded-2xl transition-all shadow-lg shadow-[#1E90FF]/30 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                >
                  {joinQuiz.isPending ? (
                    "Đang vào phòng..."
                  ) : (
                    <>
                      Vào Game
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 bg-transparent text-slate-500 hover:text-slate-700
                   hover:bg-slate-100 font-bold text-sm p-3 rounded-xl transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-slate-400 text-sm font-medium">
          Powered by IES Viện Khoa Học Sáng Tạo Khởi Nghiệp ©{" "}
          {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default LiveQuizJoinPage;
