import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LessonQuiz from "../../components/student/LessonQuiz";
import LessonSidebar, {
  getItemTypeIcon,
  getItemTypeColor,
} from "../../components/student/LessonSidebar";
import { useCourseDetail } from "../../hooks/useCourses";
import {
  getLessonById,
  getLessonItemById,
  getQuizByLessonId,
  trackVideoHeartbeat,
  markLessonItemComplete,
} from "../../services/lessonService";
import type {
  ApiLesson,
  LessonItem,
  LessonQuiz as LessonQuizType,
} from "../../types/learningTypes";
import PdfSlideshow from "@/components/common/PdfSlideshow";

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
    loading: courseLoading,
    error: courseError,
  } = useCourseDetail(courseId);

  // Data states
  const [lessonsWithItems, setLessonsWithItems] = useState<ApiLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<ApiLesson | null>(null);
  const [currentItem, setCurrentItem] = useState<LessonItem | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [quiz, setQuiz] = useState<LessonQuizType | null>(null);

  // Progress tracking states
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(
    new Set(),
  );
  const [markingComplete, setMarkingComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const lastValidTimeRef = useRef<number>(0);

  // UI states
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonSidebarOpen, setIsLessonSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  // Handle lesson item selection
  const handleItemSelect = useCallback(async (item: LessonItem) => {
    setLoadingItem(true);
    setCurrentItem(item);
    setIsLessonSidebarOpen(false);
    try {
      const detail = await getLessonItemById(item.id);
      if (detail) {
        setCurrentItem(detail);
      }
    } catch (error) {
      console.error("Failed to fetch item detail", error);
    } finally {
      setLoadingItem(false);
    }
  }, []);

  // Fetch lesson details with lessonItems once course is loaded
  useEffect(() => {
    const loadLessonDetails = async () => {
      if (!course?.lessons || course.lessons.length === 0) {
        setIsLoading(false);
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
          const quizData = await getQuizByLessonId(targetLesson.id);
          setQuiz(quizData);

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
      loadLessonDetails();
    }
  }, [course, lessonId, courseId, handleItemSelect]);

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

  // Handle mark item complete (for TEXT, PDF, PPT)
  const handleMarkComplete = useCallback(async () => {
    if (!currentItem || completedItemIds.has(currentItem.id)) return;

    setMarkingComplete(true);
    try {
      await markLessonItemComplete(currentItem.id);
      setCompletedItemIds((prev) => new Set(prev).add(currentItem.id));
    } catch (error) {
      console.error("Failed to mark item complete:", error);
    } finally {
      setMarkingComplete(false);
    }
  }, [currentItem, completedItemIds, courseId, lessonsWithItems.length]);

  // Video heartbeat tracking
  const startVideoHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      if (video && currentItem && !video.paused) {
        trackVideoHeartbeat({
          lessonItemId: currentItem.id,
          currentSecond: Math.floor(video.currentTime),
          totalDuration: Math.floor(video.duration),
        }).catch((err) => console.error("Heartbeat failed:", err));
      }
    }, 10000); // Every 10 seconds
  }, [currentItem]);

  const stopVideoHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Handle video ended - mark as complete
  const handleVideoEnded = useCallback(async () => {
    stopVideoHeartbeat();
    if (currentItem && !completedItemIds.has(currentItem.id)) {
      try {
        await markLessonItemComplete(currentItem.id);
        setCompletedItemIds((prev) => new Set(prev).add(currentItem.id));
      } catch (error) {
        console.error("Failed to mark video complete:", error);
      }
    }
  }, [
    currentItem,
    completedItemIds,
    courseId,
    lessonsWithItems.length,
    stopVideoHeartbeat,
  ]);

  // Cleanup heartbeat on unmount or item change
  useEffect(() => {
    return () => {
      stopVideoHeartbeat();
    };
  }, [currentItem, stopVideoHeartbeat]);

  // Video handlers
  const handleVideoLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (
        currentItem?.type === "VIDEO" &&
        currentItem.content?.lastWatchedSecond
      ) {
        video.currentTime = currentItem.content.lastWatchedSecond;
        lastValidTimeRef.current = currentItem.content.lastWatchedSecond;
      } else {
        lastValidTimeRef.current = 0;
      }
    },
    [currentItem],
  );

  const handleVideoSeeking = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      // Skip check if item is completed
      if (currentItem && completedItemIds.has(currentItem.id)) return;

      // If user tries to seek forward beyond what they've watched + buffer, reset to last valid position
      if (video.currentTime > lastValidTimeRef.current + 2) {
        video.currentTime = lastValidTimeRef.current;
      }
    },
    [currentItem, completedItemIds],
  );

  const handleVideoTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      // Only update lastValidTime if current time is greater (moving forward naturally)
      if (video.currentTime > lastValidTimeRef.current) {
        lastValidTimeRef.current = video.currentTime;
      }
    },
    [],
  );

  // Navigate to next/previous lesson
  const handleNavigateLesson = (direction: "prev" | "next") => {
    if (!currentLesson) return;
    const currentIndex = lessonsWithItems.findIndex(
      (l) => l.id === currentLesson.id,
    );
    const targetIndex =
      direction === "prev" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < lessonsWithItems.length) {
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
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] color-primary animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-[#4A5568]">Đang tải bài học...</p>
        </div>
      </div>
    );
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

  // Content Viewer
  const renderContentViewer = () => {
    if (!currentItem) {
      return (
        <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl">
          <div className="text-center text-gray-500">
            <span className="material-symbols-outlined text-5xl mb-2">
              play_lesson
            </span>
            <p>Chọn một nội dung từ danh sách bên trái để bắt đầu học</p>
          </div>
        </div>
      );
    }

    if (loadingItem) {
      return (
        <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl">
          <span className="material-symbols-outlined animate-spin text-3xl text-blue-600">
            progress_activity
          </span>
        </div>
      );
    }

    const content = currentItem.content;
    const isCompleted = completedItemIds.has(currentItem.id);

    if (currentItem.type === "VIDEO" && content?.resourceUrl) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-black relative">
            <video
              ref={videoRef}
              src={content.resourceUrl}
              controls
              controlsList="nodownload"
              className="w-full aspect-video"
              poster={course.thumbnailUrl}
              onPlay={startVideoHeartbeat}
              onPause={stopVideoHeartbeat}
              onEnded={handleVideoEnded}
              onSeeking={handleVideoSeeking}
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedMetadata={handleVideoLoadedMetadata}
            />
            {isCompleted && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 text-white rounded-full text-sm font-medium">
                <span className="material-symbols-outlined text-sm">check</span>
                Đã xem
              </div>
            )}
          </div>
          {!isCompleted && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
              <span className="material-symbols-outlined text-lg">info</span>
              <span>
                Xem video đến hết để hoàn thành bài học. Video không thể tua
                nhanh.
              </span>
            </div>
          )}
        </div>
      );
    }

    if (currentItem.type === "PDF" && content?.resourceUrl) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <PdfSlideshow fileUrl={content.resourceUrl} />
          </div>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {markingComplete ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    check_circle
                  </span>
                  Đánh dấu đã học xong
                </>
              )}
            </button>
          )}
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
              <span className="material-symbols-outlined text-lg">check</span>
              Đã hoàn thành
            </div>
          )}
        </div>
      );
    }

    if (currentItem.type === "PPT" && content?.resourceUrl) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <PdfSlideshow fileUrl={content.resourceUrl} />
          </div>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {markingComplete ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    check_circle
                  </span>
                  Đánh dấu đã học xong
                </>
              )}
            </button>
          )}
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
              <span className="material-symbols-outlined text-lg">check</span>
              Đã hoàn thành
            </div>
          )}
        </div>
      );
    }

    if (currentItem.type === "TEXT") {
      return (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="prose prose-sm max-w-none">
              {content?.textContent || "Không có nội dung văn bản"}
            </div>
          </div>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {markingComplete ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    check_circle
                  </span>
                  Đánh dấu đã học xong
                </>
              )}
            </button>
          )}
          {isCompleted && (
            <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
              <span className="material-symbols-outlined text-lg">check</span>
              Đã hoàn thành
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl">
        <div className="text-center text-gray-500">
          <span className="material-symbols-outlined text-5xl mb-2">
            description
          </span>
          <p>Không thể hiển thị nội dung này</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b rounded-lg border-gray-200 bg-white px-4 md:px-6 py-3 shadow-sm z-10">
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setIsLessonSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:color-primary"
          >
            <span className="material-symbols-outlined">menu_open</span>
          </button>

          {!isDesktopSidebarOpen && (
            <button
              onClick={() => setIsDesktopSidebarOpen(true)}
              className="hidden lg:block text-gray-500 hover:color-primary transition-colors mr-2"
              title="Mở rộng nội dung"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}

          <Link
            to="/student/my-courses"
            className="flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:color-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
            <span className="hidden sm:inline">Quay lại</span>
          </Link>
          <div className="hidden sm:block h-6 w-px bg-gray-200"></div>
          <h2 className="text-base font-semibold leading-tight tracking-tight text-[#1A2B3C] line-clamp-1 max-w-[150px] sm:max-w-xs md:max-w-md">
            {course.name}
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
            onClick={() => handleNavigateLesson("prev")}
            disabled={currentLessonIndex === 0}
            className="flex items-center gap-1 text-sm font-medium text-[#4A5568] hover:text-[#1A2B3C] px-2 md:px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Bài trước</span>
            <span className="sm:hidden material-symbols-outlined">
              chevron_left
            </span>
          </button>
          <button
            onClick={() => handleNavigateLesson("next")}
            disabled={currentLessonIndex === lessonsWithItems.length - 1}
            className="flex min-w-[40px] md:min-w-[120px] cursor-pointer items-center justify-center rounded-lg color-primary-bg px-3 md:px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Bài tiếp theo</span>
            <span className="sm:hidden material-symbols-outlined">
              chevron_right
            </span>
          </button>
        </div>
      </header>

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
            {renderContentViewer()}

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
            <div className="mt-4 sm:mt-6 flex flex-col">
              <div className="flex gap-6 sm:gap-8 border-b border-gray-200 scrollbar-hide -mx-4 sm:mx-0 px-0 sm:px-2">
                {[
                  { id: "overview", label: "Tổng quan" },
                  // { id: "materials", label: "Tài liệu" },
                  // { id: "discussion", label: "Thảo luận" },
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
                    {tab.id === "quiz" && quiz && (
                      <span className="absolute ml-[-100px] mt-[-12px] px-2 py-0.5 color-primary text-[10px] font-bold rounded-full">
                        {quiz.questions.length}
                      </span>
                    )}
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

                {/* {activeTab === "materials" && (
                  <div className="max-w-2xl">
                    {currentLesson?.lessonItems &&
                    currentLesson.lessonItems.length > 0 ? (
                      <div className="space-y-3">
                        {currentLesson.lessonItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleItemSelect(item)}
                            className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`size-10 rounded-lg flex items-center justify-center ${getItemTypeColor(item.type)}`}
                              >
                                <span className="material-symbols-outlined">
                                  {getItemTypeIcon(item.type)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm text-[#1A2B3C]">
                                  {item.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.type}
                                </p>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-400">
                              chevron_right
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2">
                          folder_open
                        </span>
                        <p>Không có tài liệu đính kèm</p>
                      </div>
                    )}
                  </div>
                )} */}

                {/* {activeTab === "discussion" && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">
                      forum
                    </span>
                    <p>Tính năng thảo luận sẽ sớm được cập nhật</p>
                  </div>
                )} */}

                {activeTab === "quiz" && (
                  <div className="max-w-2xl">
                    {quiz ? (
                      <LessonQuiz quiz={quiz} />
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2">
                          quiz
                        </span>
                        <p>Bài học này chưa có bài kiểm tra</p>
                      </div>
                    )}
                  </div>
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
