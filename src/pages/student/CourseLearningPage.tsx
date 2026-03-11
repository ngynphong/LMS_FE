import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LessonSidebar, {
  getItemTypeIcon,
  getItemTypeColor,
} from "@/components/student/LessonSidebar";
import { useCourseDetail } from "@/hooks/useCourses";
import { useQuizByLessonItem } from "@/hooks/useQuizzes";
import { getLessonById, getLessonItemById } from "@/services/lessonService";
import type { ApiLesson, LessonItem } from "@/types/learningTypes";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import CourseLearningHeader from "@/components/student/course-learning/CourseLearningHeader";
import CourseContentViewer from "@/components/student/course-learning/CourseContentViewer";
import CourseQuizTab from "@/components/student/course-learning/CourseQuizTab";

type TabType = "overview" | "quiz";

const CourseLearningPage = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId?: string;
  }>();
  const navigate = useNavigate();

  // Fetch course with useCourseDetail hook
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseDetail(courseId);

  // Data states
  const [lessonsWithItems, setLessonsWithItems] = useState<ApiLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<ApiLesson | null>(null);
  const [currentItem, setCurrentItem] = useState<LessonItem | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const { data: lessonQuizzes, isLoading: quizLoading } = useQuizByLessonItem(
    currentItem?.id,
  );

  const handleStartQuiz = (quizId: string) => {
    navigate(`/student/quizzes/${quizId}/take`);
  };

  // Progress tracking states
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(
    new Set(),
  );

  // UI states
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonSidebarOpen, setIsLessonSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const fetchedItemIds = useRef<Set<string>>(new Set());

  // Handle lesson item selection
  const handleItemSelect = useCallback(async (item: LessonItem) => {
    if (fetchedItemIds.current.has(item.id)) {
      setCurrentItem(item);
      setIsLessonSidebarOpen(false);
      return;
    }

    setLoadingItem(true);
    setCurrentItem(item);
    setIsLessonSidebarOpen(false);
    try {
      const detail = await getLessonItemById(item.id);
      if (detail) {
        fetchedItemIds.current.add(item.id);
        setCurrentItem(detail);
        setLessonsWithItems((prevLessons) =>
          prevLessons.map((lesson) => {
            if (
              lesson.lessonItems &&
              lesson.lessonItems.some((i) => i.id === detail.id)
            ) {
              return {
                ...lesson,
                lessonItems: lesson.lessonItems.map((i) =>
                  i.id === detail.id ? detail : i,
                ),
              };
            }
            return lesson;
          }),
        );
      } else {
        // Mark as fetched even if detail is null to prevent infinite retries
        fetchedItemIds.current.add(item.id);
      }
    } catch (error) {
      console.error("Failed to fetch item detail", error);
    } finally {
      setLoadingItem(false);
    }
  }, []);

  const lastLoadedCourseId = useRef<string | null>(null);

  // Fetch lesson details with lessonItems once course is loaded
  useEffect(() => {
    const initCourse = async () => {
      if (!course?.lessons || course.lessons.length === 0) {
        setIsLoading(false);
        return;
      }

      if (lastLoadedCourseId.current === course.id) {
        let targetLesson = lessonsWithItems.find((l) => l.id === lessonId);
        if (!targetLesson) {
          targetLesson = lessonsWithItems[0];
        }
        if (targetLesson && targetLesson.id !== currentLesson?.id) {
          setCurrentLesson(targetLesson);
          if (targetLesson.lessonItems && targetLesson.lessonItems.length > 0) {
            handleItemSelect(targetLesson.lessonItems[0]);
          } else {
            setCurrentItem(null);
          }
        }
        return;
      }

      setIsLoading(true);
      try {
        const updatedLessons = await Promise.all(
          course.lessons.map(async (lesson) => {
            try {
              const detail = await getLessonById(lesson.id);
              return detail || lesson;
            } catch {
              return lesson;
            }
          }),
        );
        setLessonsWithItems(updatedLessons);

        // Initialize completed items from fetched data
        const initialCompletedIds = new Set<string>();
        updatedLessons.forEach((lesson) => {
          lesson.lessonItems?.forEach((item) => {
            if (item.completed) {
              initialCompletedIds.add(item.id);
            }
          });
        });
        setCompletedItemIds(initialCompletedIds);

        lastLoadedCourseId.current = course.id;

        // Set current lesson
        let targetLesson: ApiLesson | undefined;
        if (lessonId) {
          targetLesson = updatedLessons.find((l) => l.id === lessonId);
        }
        if (!targetLesson) {
          targetLesson = updatedLessons[0];
        }
        if (targetLesson) {
          setCurrentLesson(targetLesson);

          if (targetLesson.lessonItems && targetLesson.lessonItems.length > 0) {
            handleItemSelect(targetLesson.lessonItems[0]);
          }
        }
      } catch (error) {
        console.error("Error loading lesson details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (course) {
      initCourse();
    }
  }, [
    course,
    lessonId,
    courseId,
    currentLesson?.id,
    lessonsWithItems,
    handleItemSelect,
  ]);

  // Handle lesson selection
  const handleLessonSelect = useCallback(
    async (selectedLessonId: string) => {
      const lesson = lessonsWithItems.find((l) => l.id === selectedLessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setActiveTab("overview");
        setIsLessonSidebarOpen(false);

        if (lesson.lessonItems && lesson.lessonItems.length > 0) {
          handleItemSelect(lesson.lessonItems[0]);
        } else {
          setCurrentItem(null);
        }

        navigate(`/student/courses/${courseId}/lessons/${selectedLessonId}`, {
          replace: true,
        });
      }
    },
    [lessonsWithItems, courseId, navigate, handleItemSelect],
  );

  const handleItemCompleted = useCallback((itemId: string) => {
    setCompletedItemIds((prev) => new Set(prev).add(itemId));
  }, []);

  // Determine if the current lesson is complete
  const isCurrentLessonComplete = currentLesson
    ? currentLesson.completed ||
      (currentLesson.lessonItems && currentLesson.lessonItems.length > 0
        ? currentLesson.lessonItems.every((item) =>
            completedItemIds.has(item.id),
          )
        : true)
    : false;

  // Navigate to next/previous lesson
  const handleNavigateLesson = (direction: "prev" | "next") => {
    if (!currentLesson) return;
    const currentIndex = lessonsWithItems.findIndex(
      (l) => l.id === currentLesson.id,
    );
    const targetIndex =
      direction === "prev" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < lessonsWithItems.length) {
      if (direction === "next" && !isCurrentLessonComplete) {
        return;
      }

      const targetLesson = lessonsWithItems[targetIndex];
      if (!targetLesson.isLocked) {
        handleLessonSelect(targetLesson.id);
      }
    }
  };

  const currentLessonIndex = currentLesson
    ? lessonsWithItems.findIndex((l) => l.id === currentLesson.id)
    : 0;
  const totalItems = lessonsWithItems.reduce(
    (acc, lesson) => acc + (lesson.lessonItems?.length || 0),
    0,
  );
  const progressPercent =
    totalItems > 0 ? Math.round((completedItemIds.size / totalItems) * 100) : 0;

  // Loading state
  if (courseLoading || isLoading) {
    return <LoadingOverlay isLoading={true} message="Đang tải bài học..." />;
  }

  // Error state
  if (courseError || !course) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <span className="material-symbols-outlined text-[64px] text-gray-400">
            school
          </span>
          <p className="mt-4 text-[#4A5568]">Không tìm thấy khóa học</p>
          <Link
            to="/student/my-courses"
            className="mt-4 inline-block color-primary hover:underline"
          >
            ← Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Header */}
      <CourseLearningHeader
        courseName={course.name}
        progressPercent={progressPercent}
        currentLessonIndex={currentLessonIndex}
        totalLessons={lessonsWithItems.length}
        isCurrentLessonComplete={isCurrentLessonComplete}
        onNavigateLesson={handleNavigateLesson}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        onToggleDesktopSidebar={() => setIsDesktopSidebarOpen(true)}
        onToggleMobileSidebar={() => setIsLessonSidebarOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Component */}
        <LessonSidebar
          lessons={lessonsWithItems}
          currentLesson={currentLesson}
          currentItem={currentItem}
          isOpen={isLessonSidebarOpen}
          onClose={() => setIsLessonSidebarOpen(false)}
          onLessonSelect={handleLessonSelect}
          onItemSelect={handleItemSelect}
          completedItemIds={completedItemIds}
          isDesktopOpen={isDesktopSidebarOpen}
          onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
        />

        {/* Content Area */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f5f7fa] w-full">
          <div className="w-full max-w-[1100px] mx-auto p-4 md:p-6 flex flex-col gap-4">
            {/* Content Viewer */}
            <CourseContentViewer
              currentItem={currentItem}
              courseThumbnailUrl={course.thumbnailUrl}
              loadingItem={loadingItem}
              completedItemIds={completedItemIds}
              onItemCompleted={handleItemCompleted}
            />

            {/* Current Item Info */}
            {currentItem && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center ${getItemTypeColor(currentItem.type)}`}
                  >
                    <span className="material-symbols-outlined">
                      {getItemTypeIcon(currentItem.type)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {currentItem.title}
                    </h3>
                    <p className="text-xs text-slate-500">{currentItem.type}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="mt-4 sm:mt-6 flex flex-col px-2">
              <div className="flex gap-6 sm:gap-8 border-b border-gray-200 scrollbar-hide -mx-4 sm:mx-0 px-0 sm:px-2">
                {[
                  { id: "overview", label: "Tổng quan" },
                  { id: "quiz", label: "Bài kiểm tra" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`relative pb-3 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === tab.id
                        ? "border-b-2 border-[#1E90FF] color-primary font-semibold"
                        : "text-[#4A5568] hover:text-[#1E90FF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#1A2B3C]">
                      {currentLesson?.title}
                    </h3>
                    <p className="text-[#4A5568] leading-relaxed text-sm">
                      {currentItem?.description ||
                        currentLesson?.description ||
                        "Không có mô tả cho bài học này."}
                    </p>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <CourseQuizTab
                    lessonQuizzes={lessonQuizzes as any}
                    quizLoading={quizLoading}
                    onStartQuiz={handleStartQuiz}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseLearningPage;
