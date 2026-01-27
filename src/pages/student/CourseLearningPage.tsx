import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LessonSidebar from "../../components/student/LessonSidebar";
import VideoPlayer from "../../components/student/VideoPlayer";
import LessonQuiz from "../../components/student/LessonQuiz";
import type {
  ApiCourse,
  ApiLesson,
  LessonQuiz as LessonQuizType,
  CourseProgress,
  QuizResult,
} from "../../types/learningTypes";
import {
  getCourseById,
  getLessonsByCourseId,
  getQuizByLessonId,
  getCourseProgress,
  updateLessonProgress,
} from "../../services/courseService";

type TabType = "overview" | "materials" | "discussion" | "quiz";

const CourseLearningPage = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId?: string;
  }>();
  const navigate = useNavigate();

  // Data states
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<ApiLesson | null>(null);
  const [quiz, setQuiz] = useState<LessonQuizType | null>(null);
  const [progress, setProgress] = useState<CourseProgress>({
    courseId: courseId || "",
    completedLessons: 0,
    totalLessons: 0,
    progressPercent: 0,
    lessonProgress: {},
  });

  // UI states
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      try {
        const [courseData, lessonsData, progressData] = await Promise.all([
          getCourseById(courseId),
          getLessonsByCourseId(courseId),
          getCourseProgress(courseId),
        ]);

        if (courseData) setCourse(courseData);
        if (lessonsData.length > 0) {
          setLessons(lessonsData);

          // Set current lesson
          let targetLesson: ApiLesson | undefined;
          if (lessonId) {
            targetLesson = lessonsData.find((l) => l.id === lessonId);
          }
          if (!targetLesson) {
            // Find first non-completed lesson or first lesson
            targetLesson =
              lessonsData.find((l) => !l.isCompleted && !l.isLocked) ||
              lessonsData[0];
          }
          if (targetLesson) {
            setCurrentLesson(targetLesson);
            // Load quiz for this lesson
            const quizData = await getQuizByLessonId(targetLesson.id);
            setQuiz(quizData);
          }
        }

        if (progressData) {
          progressData.totalLessons = lessonsData.length;
          setProgress(progressData);
        }
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [courseId, lessonId]);

  // Handle lesson selection
  const handleLessonSelect = useCallback(
    async (selectedLessonId: string) => {
      const lesson = lessons.find((l) => l.id === selectedLessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setActiveTab("overview");

        // Load quiz for this lesson
        const quizData = await getQuizByLessonId(selectedLessonId);
        setQuiz(quizData);

        // Update URL
        navigate(`/student/courses/${courseId}/lessons/${selectedLessonId}`, {
          replace: true,
        });
      }
    },
    [lessons, courseId, navigate],
  );

  // Handle quiz completion
  const handleQuizComplete = useCallback(
    async (result: QuizResult) => {
      if (result.passed && currentLesson && courseId) {
        await updateLessonProgress(courseId, currentLesson.id, true);
        // Refresh progress
        const updatedProgress = await getCourseProgress(courseId);
        updatedProgress.totalLessons = lessons.length;
        setProgress(updatedProgress);
      }
    },
    [currentLesson, courseId, lessons.length],
  );

  // Navigate to next/previous lesson
  const handleNavigateLesson = (direction: "prev" | "next") => {
    if (!currentLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
    const targetIndex =
      direction === "prev" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < lessons.length) {
      const targetLesson = lessons[targetIndex];
      if (!targetLesson.isLocked) {
        handleLessonSelect(targetLesson.id);
      }
    }
  };

  const currentLessonIndex = currentLesson
    ? lessons.findIndex((l) => l.id === currentLesson.id)
    : 0;
  const progressPercent =
    lessons.length > 0
      ? Math.round(
          (Object.values(progress.lessonProgress).filter((p) => p.isCompleted)
            .length /
            lessons.length) *
            100,
        )
      : 0;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-[#0077BE] animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-[#4A5568]">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <span className="material-symbols-outlined text-[64px] text-gray-400">
            school
          </span>
          <p className="mt-4 text-[#4A5568]">Không tìm thấy khóa học</p>
          <Link
            to="/student/my-courses"
            className="mt-4 inline-block text-[#0077BE] hover:underline"
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
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <Link
            to="/student/my-courses"
            className="flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:text-[#0077BE] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
            Quay lại
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>
          <h2 className="text-base font-semibold leading-tight tracking-tight text-[#1A2B3C]">
            {course.name}
          </h2>
        </div>

        {/* Progress */}
        <div className="hidden md:flex flex-col items-center gap-1 min-w-[200px]">
          <div className="flex w-full justify-between text-[11px] text-[#4A5568]">
            <span>Tiến độ học tập</span>
            <span className="font-bold text-[#0077BE]">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#0077BE] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavigateLesson("prev")}
            disabled={currentLessonIndex === 0}
            className="flex items-center gap-1 text-sm font-medium text-[#4A5568] hover:text-[#1A2B3C] px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bài trước
          </button>
          <button
            onClick={() => handleNavigateLesson("next")}
            disabled={currentLessonIndex === lessons.length - 1}
            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg bg-[#0077BE] px-4 py-2 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Bài tiếp theo</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <LessonSidebar
          course={course}
          lessons={lessons}
          currentLessonId={currentLesson.id}
          progress={progress}
          onLessonSelect={handleLessonSelect}
        />

        {/* Content Area */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f5f7fa]">
          <div className="w-full max-w-[1100px] mx-auto p-6 flex flex-col gap-4">
            {/* Video Player */}
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              thumbnailUrl={course.thumbnail}
              duration={currentLesson.duration}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between px-2">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium transition-colors shadow-sm ${
                    isFavorite
                      ? "text-red-500 border-red-200"
                      : "text-[#4A5568] hover:bg-gray-50 hover:text-[#1A2B3C]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${isFavorite ? "FILL" : ""}`}
                  >
                    favorite
                  </span>
                  Yêu thích
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-[#4A5568] hover:bg-gray-50 hover:text-[#1A2B3C] transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    edit_note
                  </span>
                  Thêm ghi chú
                </button>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-[#4A5568] opacity-70">
                  Đang xem bài {currentLessonIndex + 1} trên tổng số{" "}
                  {lessons.length} bài
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex flex-col">
              <div className="flex gap-8 border-b border-gray-200 px-2">
                {[
                  { id: "overview", label: "Tổng quan bài học" },
                  { id: "materials", label: "Tài liệu đính kèm" },
                  { id: "discussion", label: "Thảo luận Q&A" },
                  { id: "quiz", label: "Bài kiểm tra" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`relative pb-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-[#0077BE] text-[#0077BE] font-semibold"
                        : "text-[#4A5568] hover:text-[#1A2B3C]"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "quiz" && quiz && (
                      <span className="ml-2 px-2 py-0.5 bg-[#0077BE]/10 text-[#0077BE] text-[10px] font-bold rounded-full">
                        {quiz.questions.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-xl font-bold text-[#1A2B3C]">
                        {currentLesson.title}
                      </h3>
                      <p className="text-[#4A5568] leading-relaxed text-sm">
                        {currentLesson.description ||
                          "Không có mô tả cho bài học này."}
                      </p>
                      {currentLesson.tags && currentLesson.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {currentLesson.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-[#0077BE]/10 px-3 py-1 text-[11px] font-medium text-[#0077BE]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Materials sidebar in overview */}
                    {currentLesson.attachments &&
                      currentLesson.attachments.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#4A5568]/60">
                            Tài liệu học tập
                          </h4>
                          <div className="space-y-3">
                            {currentLesson.attachments.map((att) => (
                              <div
                                key={att.id}
                                className="flex items-center justify-between rounded-lg bg-white p-3 border border-gray-100 shadow-sm"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <span className="material-symbols-outlined text-[#0077BE]">
                                    {att.type === "pdf"
                                      ? "description"
                                      : att.type === "code"
                                        ? "code"
                                        : "attachment"}
                                  </span>
                                  <span className="truncate text-xs font-medium text-[#1A2B3C]">
                                    {att.name}
                                  </span>
                                </div>
                                <button className="text-[#0077BE] hover:text-[#1A2B3C] transition-colors">
                                  <span className="material-symbols-outlined text-[20px]">
                                    download
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Materials Tab */}
                {activeTab === "materials" && (
                  <div className="max-w-2xl">
                    {currentLesson.attachments &&
                    currentLesson.attachments.length > 0 ? (
                      <div className="space-y-3">
                        {currentLesson.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between rounded-lg bg-white p-4 border border-gray-100 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#0077BE]/10 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#0077BE]">
                                  {att.type === "pdf"
                                    ? "picture_as_pdf"
                                    : att.type === "code"
                                      ? "code"
                                      : "attachment"}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-[#1A2B3C]">
                                  {att.name}
                                </p>
                                {att.size && (
                                  <p className="text-xs text-gray-500">
                                    {att.size}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button className="px-4 py-2 text-[#0077BE] hover:bg-[#0077BE]/5 rounded-lg transition-colors font-medium text-sm">
                              Tải xuống
                            </button>
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
                )}

                {/* Discussion Tab */}
                {activeTab === "discussion" && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">
                      forum
                    </span>
                    <p>Tính năng thảo luận sẽ sớm được cập nhật</p>
                  </div>
                )}

                {/* Quiz Tab */}
                {activeTab === "quiz" && (
                  <div className="max-w-2xl">
                    {quiz ? (
                      <LessonQuiz quiz={quiz} onComplete={handleQuizComplete} />
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
