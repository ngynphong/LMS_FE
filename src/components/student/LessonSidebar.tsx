import { useMemo } from "react";
import type {
  ApiCourse,
  ApiLesson,
  LessonListItem,
  LessonStatus,
  CourseProgress,
} from "../../types/learningTypes";

interface LessonSidebarProps {
  course: ApiCourse;
  lessons: ApiLesson[];
  currentLessonId: string;
  progress: CourseProgress;
  onLessonSelect: (lessonId: string) => void;
}

const LessonSidebar = ({
  lessons,
  currentLessonId,
  progress,
  onLessonSelect,
}: LessonSidebarProps) => {
  // Calculate lesson status based on progress and order
  const lessonItems: LessonListItem[] = useMemo(() => {
    return lessons.map((lesson, index) => {
      let status: LessonStatus = "available";

      const lessonProgress = progress.lessonProgress[lesson.id];

      if (lessonProgress?.isCompleted || lesson.isCompleted) {
        status = "completed";
      } else if (lesson.id === currentLessonId) {
        status = "current";
      } else if (lesson.isLocked) {
        // Unlock logic: previous lesson must be completed
        const prevLesson = lessons[index - 1];
        if (prevLesson) {
          const prevProgress = progress.lessonProgress[prevLesson.id];
          if (!prevProgress?.isCompleted && !prevLesson.isCompleted) {
            status = "locked";
          }
        }
      }

      return { ...lesson, status };
    });
  }, [lessons, currentLessonId, progress]);

  const completedCount = lessonItems.filter(
    (l) => l.status === "completed",
  ).length;

  const handleLessonClick = (lesson: LessonListItem) => {
    if (lesson.status !== "locked") {
      onLessonSelect(lesson.id);
    }
  };

  const getStatusIcon = (status: LessonStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="material-symbols-outlined FILL text-emerald-500 text-[20px]">
            check_circle
          </span>
        );
      case "current":
        return (
          <span className="material-symbols-outlined FILL text-white text-[20px]">
            play_circle
          </span>
        );
      case "locked":
        return (
          <span className="material-symbols-outlined text-gray-400 text-[20px]">
            lock
          </span>
        );
      default:
        return (
          <span className="material-symbols-outlined text-gray-400 text-[20px]">
            radio_button_unchecked
          </span>
        );
    }
  };

  return (
    <aside className="w-80 flex flex-col border-r border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-[#f5f7fa]">
        <h1 className="text-base font-semibold text-[#1A2B3C]">
          Nội dung khóa học
        </h1>
        <p className="mt-1 text-xs text-[#4A5568]">
          Đã hoàn thành {completedCount}/{lessons.length} bài học
        </p>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {lessonItems.map((lesson) => {
            const isCurrent = lesson.status === "current";
            const isLocked = lesson.status === "locked";

            return (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors
                  ${
                    isCurrent
                      ? "bg-[#0077BE] shadow-md"
                      : isLocked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#f5f7fa] cursor-pointer"
                  }
                `}
              >
                {getStatusIcon(lesson.status)}
                <div className="flex flex-col flex-1 min-w-0">
                  <span
                    className={`text-sm font-medium truncate ${
                      isCurrent
                        ? "text-white"
                        : isLocked
                          ? "text-gray-500"
                          : "text-[#4A5568]"
                    }`}
                  >
                    {lesson.title}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isCurrent ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {lesson.duration || "--:--"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default LessonSidebar;
