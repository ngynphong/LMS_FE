import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import CourseOutline, {
  type OutlineItem,
} from "../../components/teacher/courses/CourseOutline";
import CourseForm from "../../components/teacher/courses/CourseForm";
import LessonForm from "../../components/teacher/courses/LessonForm";
import LessonItemForm from "../../components/teacher/courses/LessonItemForm";
import {
  useCreateCourse,
  useUpdateCourse,
  useCourseDetail,
  useApproveCourse,
} from "../../hooks/useCourses";
import {
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useCreateLessonItem,
  useUpdateLessonItem,
  useDeleteLessonItem,
} from "../../hooks/useLessons";
import { getLessonById, getLessonItemById } from "../../services/lessonService";
import type {
  ApiCourse,
  ApiLesson,
  LessonItem,
} from "../../types/learningTypes";

const CourseBuilderPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  // Course State
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [courseId, setCourseId] = useState<string | null>(id || null);
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [selectedItem, setSelectedItem] = useState<OutlineItem | null>({
    type: "course",
    id: "new",
    title: "Khóa học mới",
  });
  const [pendingLessonId, setPendingLessonId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: "lesson" | "item";
    title: string;
  }>({ open: false, type: "lesson", title: "" });
  const [itemDetail, setItemDetail] = useState<LessonItem | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch item detail when selected
  useEffect(() => {
    const fetchItemDetail = async () => {
      if (selectedItem?.type === "item" && selectedItem.id !== "new") {
        const detail = await getLessonItemById(selectedItem.id);
        setItemDetail(detail);
      } else {
        setItemDetail(null);
      }
    };
    fetchItemDetail();
  }, [selectedItem]);

  // Hooks
  const { create: createCourse, loading: creatingCourse } = useCreateCourse();
  const { update: updateCourse, loading: updatingCourse } = useUpdateCourse();
  const {
    data: courseData,
    loading: loadingCourse,
    refetch: refetchCourse,
  } = useCourseDetail(id);
  const { create: createLesson, loading: creatingLesson } = useCreateLesson();
  const { update: updateLesson, loading: updatingLesson } = useUpdateLesson();
  const { remove: deleteLesson, loading: deletingLesson } = useDeleteLesson();
  const { create: createLessonItem, loading: creatingItem } =
    useCreateLessonItem();
  const { update: updateLessonItem, loading: updatingItem } =
    useUpdateLessonItem();
  const { remove: deleteLessonItem, loading: deletingItem } =
    useDeleteLessonItem();
  const { approve: approveCourse, loading: publishLoading } =
    useApproveCourse();

  // Publish handler
  const handlePublish = async () => {
    if (!courseId) return;
    try {
      await approveCourse(courseId, "PUBLISHED");
      toast.success("Khóa học đã được xuất bản!");
      refetchCourse();
    } catch (error) {
      toast.error("Xuất bản thất bại. Vui lòng thử lại.");
    }
  };

  // Load course data in edit mode
  useEffect(() => {
    if (courseData) {
      setCourse(courseData);
      setCourseId(courseData.id);
      // Get lessons from course detail response
      if (courseData.lessons && Array.isArray(courseData.lessons)) {
        // Fetch lesson details to get lessonItems
        const fetchLessonDetails = async () => {
          const lessonsWithItems = await Promise.all(
            courseData.lessons!.map(async (lesson) => {
              try {
                const detail = await getLessonById(lesson.id);
                return detail || lesson;
              } catch {
                return lesson;
              }
            }),
          );
          setLessons(lessonsWithItems);
        };
        fetchLessonDetails();
      }
    }
  }, [courseData]);

  // Reload lessons - refetch course detail to get updated lessons
  const loadLessons = useCallback(async () => {
    if (!courseId) return;
    // Refetch course detail to get updated lessons
    refetchCourse();
  }, [courseId, refetchCourse]);

  // Handlers
  const handleCourseSubmit = async (data: {
    name: string;
    description: string;
    thumbnailUrl: string;
    visibility: "PUBLIC" | "PRIVATE";
  }) => {
    try {
      if (isEditMode && courseId) {
        await updateCourse(courseId, data);
        setCourse((prev) => (prev ? { ...prev, ...data } : null));
        toast.success("Đã cập nhật khóa học!");
      } else {
        const newCourse = await createCourse(data);
        setCourse(newCourse);
        setCourseId(newCourse.id);
        setLessons(newCourse.lessons || []);
        toast.success("Đã tạo khóa học! Bạn có thể thêm bài học.");
        // Update URL without page reload
        window.history.replaceState(
          null,
          "",
          `/teacher/courses/${newCourse.id}/edit`,
        );
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleAddLesson = () => {
    setSelectedItem({ type: "lesson", id: "new", title: "Bài học mới" });
  };

  const handleLessonSubmit = async (data: { title: string }) => {
    try {
      if (selectedItem?.id === "new") {
        // Create new lesson
        if (!courseId) return;
        const newLesson = await createLesson(courseId, data);
        setLessons((prev) => [...prev, newLesson]);
        setSelectedItem({
          type: "lesson",
          id: newLesson.id,
          title: newLesson.title,
        });
        toast.success("Đã thêm bài học!");
      } else if (selectedItem?.id) {
        // Update existing lesson
        await updateLesson(selectedItem.id, data.title);
        setLessons((prev) =>
          prev.map((l) =>
            l.id === selectedItem.id ? { ...l, title: data.title } : l,
          ),
        );
        toast.success("Đã cập nhật bài học!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDeleteLesson = async () => {
    if (!selectedItem?.id || selectedItem.id === "new") return;
    setDeleteModal({
      open: true,
      type: "lesson",
      title: selectedItem.title || "bài học này",
    });
  };

  const confirmDeleteLesson = async () => {
    if (!selectedItem?.id || selectedItem.id === "new") return;
    try {
      await deleteLesson(selectedItem.id);
      setLessons((prev) => prev.filter((l) => l.id !== selectedItem.id));
      setSelectedItem({
        type: "course",
        id: courseId || "new",
        title: course?.name || "Khóa học",
      });
      toast.success("Đã xóa bài học!");
    } catch (error) {
      toast.error("Không thể xóa bài học.");
    } finally {
      setDeleteModal({ open: false, type: "lesson", title: "" });
    }
  };

  const handleAddItem = (lessonId: string) => {
    setPendingLessonId(lessonId);
    setSelectedItem({
      type: "item",
      id: "new",
      title: "Nội dung mới",
      lessonId,
      itemType: "VIDEO",
    });
  };

  const handleItemSubmit = async (data: {
    title: string;
    description: string;
    textContent: string;
    file: File | null;
  }) => {
    const lessonId = selectedItem?.lessonId || pendingLessonId;
    if (!lessonId) return;

    try {
      if (selectedItem?.id === "new") {
        // Create new item
        await createLessonItem(lessonId, {
          title: data.title,
          description: data.description,
          textContent: data.textContent,
          file: data.file,
        });
        // Fetch lesson detail to get updated items
        const updatedLesson = await getLessonById(lessonId);
        if (updatedLesson) {
          setLessons((prev) =>
            prev.map((l) => (l.id === lessonId ? updatedLesson : l)),
          );
        }
        toast.success("Đã thêm nội dung!");
      } else if (selectedItem?.id) {
        // Update existing item
        await updateLessonItem(selectedItem.id, {
          title: data.title,
          description: data.description,
          textContent: data.textContent,
        });
        // Fetch lesson detail to get updated items
        const updatedLesson = await getLessonById(lessonId);
        if (updatedLesson) {
          setLessons((prev) =>
            prev.map((l) => (l.id === lessonId ? updatedLesson : l)),
          );
        }
        toast.success("Đã cập nhật nội dung!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem?.id || selectedItem.id === "new") return;
    setDeleteModal({
      open: true,
      type: "item",
      title: selectedItem.title || "nội dung này",
    });
  };

  const confirmDeleteItem = async () => {
    if (!selectedItem?.id || selectedItem.id === "new") return;
    try {
      await deleteLessonItem(selectedItem.id);
      await loadLessons();
      const lessonId = selectedItem.lessonId;
      if (lessonId) {
        const lesson = lessons.find((l) => l.id === lessonId);
        setSelectedItem({
          type: "lesson",
          id: lessonId,
          title: lesson?.title || "Bài học",
        });
      }
      toast.success("Đã xóa nội dung!");
    } catch (error) {
      toast.error("Không thể xóa nội dung.");
    } finally {
      setDeleteModal({ open: false, type: "item", title: "" });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.type === "lesson") {
      await confirmDeleteLesson();
    } else {
      await confirmDeleteItem();
    }
  };

  // Get current lesson for item form
  const getCurrentLesson = () => {
    const lessonId = selectedItem?.lessonId || pendingLessonId;
    return lessons.find((l) => l.id === lessonId);
  };

  // Get lesson index
  const getLessonIndex = (lessonId: string) => {
    return lessons.findIndex((l) => l.id === lessonId) + 1;
  };

  // Render Form based on selection
  const renderForm = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case "course":
        return (
          <CourseForm
            initialData={
              course
                ? {
                    name: course.name,
                    description: course.description,
                    thumbnailUrl: course.thumbnailUrl || "",
                    visibility:
                      (course.visibility as "PUBLIC" | "PRIVATE") || "PUBLIC",
                  }
                : undefined
            }
            onSubmit={handleCourseSubmit}
            loading={creatingCourse || updatingCourse}
            isEdit={isEditMode && !!course}
          />
        );

      case "lesson":
        const lesson = lessons.find((l) => l.id === selectedItem.id);
        return (
          <LessonForm
            initialData={lesson ? { title: lesson.title } : undefined}
            lessonNumber={
              lesson ? getLessonIndex(lesson.id) : lessons.length + 1
            }
            onSubmit={handleLessonSubmit}
            onDelete={
              selectedItem.id !== "new" ? handleDeleteLesson : undefined
            }
            loading={creatingLesson || updatingLesson || deletingLesson}
            isEdit={selectedItem.id !== "new"}
          />
        );

      case "item":
        const currentLesson = getCurrentLesson();
        const currentItem = currentLesson?.lessonItems?.find(
          (i: LessonItem) => i.id === selectedItem.id,
        );

        // Use detailed item if available and matches selection
        const displayItem =
          itemDetail && itemDetail.id === selectedItem.id
            ? itemDetail
            : currentItem;

        return (
          <LessonItemForm
            initialData={
              displayItem
                ? {
                    title: displayItem.title,
                    description: displayItem.description,
                    type: displayItem.type as "VIDEO" | "TEXT" | "PDF" | "PPT",
                    textContent: displayItem.content?.textContent || "",
                    currentFileUrl: displayItem.content?.resourceUrl || "",
                    currentFileName: displayItem.title,
                  }
                : undefined
            }
            lessonTitle={currentLesson?.title}
            onSubmit={handleItemSubmit}
            onDelete={selectedItem.id !== "new" ? handleDeleteItem : undefined}
            loading={creatingItem || updatingItem || deletingItem}
            isEdit={selectedItem.id !== "new"}
          />
        );

      default:
        return null;
    }
  };

  if (loadingCourse && isEditMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">
            progress_activity
          </span>
          <span className="text-slate-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Navigation Sidebar */}
      <TeacherSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Link
                to="/teacher/courses"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Khóa học
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-sm font-medium text-slate-900">
                {isEditMode ? "Chỉnh sửa" : "Tạo mới"}
              </span>
            </div>

            {/* Title & Actions */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                {course?.name || "Khóa học mới"}
              </h1>
              <div className="flex gap-2">
                {courseId && (
                  <button
                    onClick={handlePublish}
                    disabled={publishLoading}
                    className="flex items-center gap-2 px-4 h-10 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {publishLoading ? (
                      <span className="material-symbols-outlined text-lg animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-lg">
                        publish
                      </span>
                    )}
                    Xuất bản
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Split View Content */}
        <div className="p-8">
          <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
            {/* Left Column - Course Outline */}
            <div className="col-span-4">
              <div className="sticky top-28">
                <CourseOutline
                  course={course}
                  lessons={lessons}
                  selectedItem={selectedItem}
                  onSelectItem={setSelectedItem}
                  onAddLesson={handleAddLesson}
                  onAddItem={handleAddItem}
                  courseCreated={!!courseId}
                />
              </div>
            </div>

            {/* Right Column - Form Editor */}
            <div className="col-span-8">{renderForm()}</div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() =>
              setDeleteModal({ open: false, type: "lesson", title: "" })
            }
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-2xl">
                  delete
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Xác nhận xóa
                </h3>
                <p className="text-sm text-slate-500">
                  Bạn có chắc muốn xóa{" "}
                  {deleteModal.type === "lesson" ? "bài học" : "nội dung"} "
                  {deleteModal.title}"?
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị
              xóa vĩnh viễn.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, type: "lesson", title: "" })
                }
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingLesson || deletingItem}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deletingLesson || deletingItem ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilderPage;
