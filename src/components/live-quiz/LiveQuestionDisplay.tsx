import type { LiveQuestion } from "@/types/live-quiz";
import { Check, X } from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface LiveQuestionDisplayProps {
  question: LiveQuestion;
  mode: "READ_ONLY" | "INTERACTIVE" | "SHOW_RESULT";
  onAnswerSelect?: (answerId: string) => void;
  selectedAnswerId?: string | null;
  correctAnswerIds?: string[]; // passed when mode is SHOW_RESULT
  timeRemaining?: number; // Optional sync timer
  totalTime?: number;
  disabled?: boolean;
}

export const LiveQuestionDisplay = ({
  question,
  mode,
  onAnswerSelect,
  selectedAnswerId,
  correctAnswerIds = [],
  timeRemaining,
  totalTime,
  disabled = false,
}: LiveQuestionDisplayProps) => {
  const GridCols =
    question.answers.length > 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 lg:gap-8 h-full">
      {/* Timer Progress Bar */}
      {typeof timeRemaining === "number" &&
        typeof totalTime === "number" &&
        mode === "INTERACTIVE" && (
          <div className="w-full bg-slate-200 h-3 lg:h-4 rounded-full overflow-hidden shadow-inner relative ring-1 ring-slate-900/5">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${timeRemaining < totalTime * 0.2 ? "bg-red-500" : "bg-[#1E90FF]"}`}
              style={{
                width: `${Math.max(0, (timeRemaining / totalTime) * 100)}%`,
              }}
            />
          </div>
        )}

      {/* Question Text Box */}
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-12 lg:p-16 text-center min-h-[160px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#1E90FF]/30 via-[#1E90FF] to-[#1E90FF]/30" />
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 leading-tight tracking-tight">
          {question.content}
        </h2>
      </div>

      {/* Answers Grid */}
      <div
        className={`grid ${GridCols} gap-4 lg:gap-6 w-full flex-1 min-h-[40vh]`}
      >
        {question.answers.map((answer, index) => {
          const letterStr = LETTERS[index % LETTERS.length];
          const isSelected = selectedAnswerId === answer.id;
          const isCorrect = correctAnswerIds.includes(answer.id);

          let resultOverlay = null;

          // Determining appearance based on mode
          let opacityClass = "opacity-100";
          let stateStyles = "bg-white border-slate-200 text-slate-700";
          let transformClass = "";
          let indicatorStyles = "bg-slate-100 text-slate-500";

          if (mode === "INTERACTIVE") {
            transformClass = disabled
              ? "cursor-not-allowed"
              : "cursor-pointer hover:border-[#1E90FF] hover:shadow-lg hover:shadow-[#1E90FF]/10 active:scale-95 transition-all duration-300";

            if (selectedAnswerId) {
              if (isSelected) {
                opacityClass =
                  "opacity-100 shadow-xl shadow-[#1E90FF]/20 ring-2 ring-[#1E90FF] ring-offset-2";
                stateStyles = "bg-[#1E90FF] border-[#1E90FF] text-white";
                indicatorStyles = "bg-white/20 text-white";
              } else {
                opacityClass = "opacity-40";
              }
            } else {
              // Not selected yet, hover state
              indicatorStyles =
                "bg-slate-100 text-slate-500 group-hover:bg-[#1E90FF]/10 group-hover:text-[#1E90FF] transition-colors";
            }
          } else if (mode === "SHOW_RESULT") {
            if (isCorrect) {
              opacityClass =
                "opacity-100 scale-[1.02] z-10 shadow-2xl shadow-green-500/20";
              stateStyles = "bg-green-500 border-green-500 text-white";
              indicatorStyles = "bg-white/20 text-white";
              resultOverlay = (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-green-500">
                  <Check className="w-6 h-6 stroke-3" />
                </div>
              );
            } else {
              opacityClass = "opacity-40 grayscale-[50%]";
              if (isSelected && !isCorrect) {
                opacityClass =
                  "opacity-80 scale-95 shadow-lg shadow-red-500/10";
                stateStyles = "bg-red-50 border-red-200 text-red-600";
                indicatorStyles = "bg-red-100 text-red-600";
                resultOverlay = (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-red-500">
                    <X className="w-6 h-6 stroke-3" />
                  </div>
                );
              }
            }
          }

          return (
            <div
              key={answer.id}
              onClick={() => {
                if (
                  mode === "INTERACTIVE" &&
                  !disabled &&
                  !selectedAnswerId &&
                  onAnswerSelect
                ) {
                  onAnswerSelect(answer.id);
                }
              }}
              className={`
                group relative p-6 md:p-8 rounded-2xl flex items-center gap-6 md:gap-8
                font-bold text-xl md:text-2xl min-h-[120px] 
                border-2 shadow-sm overflow-hidden select-none
                ${stateStyles} ${transformClass} ${opacityClass}
                transition-all duration-300
              `}
            >
              <div
                className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl font-black ${indicatorStyles}`}
              >
                {letterStr}
              </div>
              <span className="flex-1 wrap-break-word">{answer.content}</span>
              {resultOverlay}
            </div>
          );
        })}
      </div>
    </div>
  );
};
