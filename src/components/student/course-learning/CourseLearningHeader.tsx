import { FaLock } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";

interface CourseLearningHeaderProps {
  courseName: string;
  progressPercent: number;
  currentLessonIndex: number;
  totalLessons: number;
  isCurrentLessonComplete: boolean;
  onNavigateLesson: (direction: "prev" | "next") => void;
  isDesktopSidebarOpen: boolean;
  onToggleDesktopSidebar: () => void;
  onToggleMobileSidebar: () => void;
}

const CourseLearningHeader = ({
  courseName,
  progressPercent,
  currentLessonIndex,
  totalLessons,
  isCurrentLessonComplete,
  onNavigateLesson,
  isDesktopSidebarOpen,
  onToggleDesktopSidebar,
  onToggleMobileSidebar,
}: CourseLearningHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b rounded-lg border-gray-200 bg-white px-4 md:px-6 py-3 shadow-sm z-10">
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-gray-500 hover:color-primary"
        >
          <span className="text-2xl">
            <IoMenu />
          </span>
        </button>

        {!isDesktopSidebarOpen && (
          <button
            onClick={onToggleDesktopSidebar}
            className="hidden lg:block text-gray-500 hover:color-primary transition-colors mr-2"
            title="Mở rộng nội dung"
          >
            <span className="text-2xl">
              <IoMenu />
            </span>
          </button>
        )}

        <Link
          to="/student/my-courses"
          className="flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:color-primary transition-colors"
        >
          <span className="text-[18px]">
            <IoIosArrowBack />
          </span>
          <span className="hidden sm:inline">Quay lại</span>
        </Link>
        <div className="hidden sm:block h-6 w-px bg-gray-200"></div>
        <h2 className="text-base font-semibold leading-tight tracking-tight text-[#1A2B3C] line-clamp-1 max-w-[150px] sm:max-w-xs md:max-w-md">
          {courseName}
        </h2>
      </div>

      {/* Progress */}
      <div className="hidden lg:flex flex-col items-center gap-1 min-w-[200px]">
        <div className="flex w-full justify-between text-[11px] text-[#4A5568]">
          <span>Tiến độ học tập</span>
          <span className="font-bold color-primary">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-full rounded-full color-primary-bg transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => onNavigateLesson("prev")}
          disabled={currentLessonIndex === 0}
          className="flex items-center gap-1 text-sm font-medium text-[#4A5568] hover:text-[#1A2B3C] px-2 md:px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="hidden sm:inline">Bài trước</span>
          <span className="sm:hidden">
            <IoIosArrowBack />
          </span>
        </button>
        <button
          onClick={() => onNavigateLesson("next")}
          disabled={
            currentLessonIndex === totalLessons - 1 || !isCurrentLessonComplete
          }
          title={
            !isCurrentLessonComplete
              ? "Vui lòng hoàn thành bài học hiện tại để tiếp tục"
              : ""
          }
          className="flex gap-1 min-w-[40px] md:min-w-[120px] cursor-pointer items-center justify-center rounded-lg color-primary-bg px-3 md:px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:flex items-center gap-1">
            <span>Bài tiếp theo</span>
          </span>
          <span className="sm:hidden">
            {!isCurrentLessonComplete ? <FaLock /> : <IoIosArrowForward />}
          </span>
        </button>
      </div>
    </header>
  );
};

export default CourseLearningHeader;
