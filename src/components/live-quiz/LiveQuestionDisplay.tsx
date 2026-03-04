import type { LiveQuestion } from "@/types/live-quiz";

// Color palette mapping closely to typical live quiz styles
const ANSWER_COLORS = [
  "bg-[#E21B3C] border-[#B51630]", // Red
  "bg-[#1368CE] border-[#0F53A5]", // Blue
  "bg-[#D89E00] border-[#AD7E00]", // Yellow
  "bg-[#26890C] border-[#1E6D09]", // Green
  "bg-[#8D3A9C] border-[#702E7C]", // Purple
  "bg-[#128B96] border-[#0E6F78]", // Teal
];

// Shapes matching colors
const SHAPES = [
  "triangle", // mapping to Red
  "diamond", // mapping to Blue
  "circle", // mapping to Yellow
  "square", // mapping to Green
  "star",
  "hexagon",
];

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

  const getShapeIcon = (shapeType: string) => {
    switch (shapeType) {
      case "triangle":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 drop-shadow-sm"
          >
            <path d="M12 2L22 20H2L12 2Z" />
          </svg>
        );
      case "diamond":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 drop-shadow-sm"
          >
            <path d="M12 2L22 12L12 22L2 12L12 2Z" />
          </svg>
        );
      case "circle":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 drop-shadow-sm"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case "square":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-9 h-9 drop-shadow-sm"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
      case "star":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-11 h-11 drop-shadow-sm"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z" />
          </svg>
        );
      default:
        return <span className="w-8 h-8 rounded-full bg-white/30 block"></span>;
    }
  };

  return (
    <div className="w-full flex w-full max-w-5xl mx-auto flex-col gap-6 lg:gap-8 h-full">
      {/* Timer Progress Bar (Optional UI layer) */}
      {typeof timeRemaining === "number" && typeof totalTime === "number" && (
        <div className="w-full bg-gray-200 h-3 lg:h-4 rounded-full overflow-hidden shadow-inner relative">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${timeRemaining < totalTime * 0.2 ? "bg-red-500" : "bg-[#1E90FF]"}`}
            style={{
              width: `${Math.max(0, (timeRemaining / totalTime) * 100)}%`,
            }}
          />
        </div>
      )}

      {/* Question Text Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 lg:p-14 text-center min-h-[200px] flex items-center justify-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {question.content}
        </h2>
      </div>

      {/* Answers Grid */}
      <div className={`grid ${GridCols} gap-4 w-full flex-1 min-h-[50vh]`}>
        {question.answers.map((answer, index) => {
          const colorClasses = ANSWER_COLORS[index % ANSWER_COLORS.length];
          const shapeName = SHAPES[index % SHAPES.length];

          const isSelected = selectedAnswerId === answer.id;
          const isCorrect = correctAnswerIds.includes(answer.id);

          let resultOverlay = null;

          // Determining appearance based on mode
          let opacityClass = "opacity-100";
          let stateRing = "";
          let transformClass = "";

          if (mode === "INTERACTIVE") {
            transformClass = disabled
              ? "cursor-not-allowed"
              : "cursor-pointer hover:brightness-110 active:scale-95 transition-transform";
            if (selectedAnswerId) {
              opacityClass = isSelected ? "opacity-100" : "opacity-30";
              stateRing = isSelected
                ? "ring-4 ring-white ring-offset-4 ring-offset-blue-500"
                : "";
            }
          } else if (mode === "SHOW_RESULT") {
            if (isCorrect) {
              opacityClass = "opacity-100 scale-[1.02] z-10 shadow-xl";
              stateRing =
                "ring-4 ring-white ring-offset-4 ring-offset-green-500";
              resultOverlay = (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-green-500">
                  <span className="material-symbols-outlined text-3xl font-bold">
                    check
                  </span>
                </div>
              );
            } else {
              opacityClass = "opacity-30 grayscale-[50%]";
              if (isSelected && !isCorrect) {
                opacityClass = "opacity-60";
                resultOverlay = (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-red-500">
                    <span className="material-symbols-outlined text-3xl font-bold">
                      close
                    </span>
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
                                relative p-6 md:p-8 rounded-xl flex items-center gap-6 md:gap-8
                                text-white font-bold text-xl md:text-2xl min-h-[120px] 
                                border-b-8 shadow-sm overflow-hidden select-none
                                ${colorClasses} ${transformClass} ${opacityClass} ${stateRing}
                                transition-all duration-300
                            `}
            >
              <div className="shrink-0 flex items-center justify-center">
                {getShapeIcon(shapeName)}
              </div>
              <span className="flex-1 drop-shadow-md break-words">
                {answer.content}
              </span>
              {resultOverlay}
            </div>
          );
        })}
      </div>
    </div>
  );
};
