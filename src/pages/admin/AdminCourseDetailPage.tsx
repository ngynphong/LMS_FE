import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useCourseDetail,
  useApproveCourse,
  useBanCourse,
} from "../../hooks/useCourses";
import { getLessonById, getLessonItemById } from "../../services/lessonService";
import type { LessonItem, ApiLesson } from "../../types/learningTypes";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const AdminCourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course, loading, error, refetch } = useCourseDetail(id);
  const [lessonsWithItems, setLessonsWithItems] = useState<ApiLesson[]>([]);
  const [viewItem, setViewItem] = useState<LessonItem | null>(null);
  const [loadingView, setLoadingView] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "APPROVE" | "BAN" | null;
    title: string;
    message: string;
    variant: "info" | "danger";
  }>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    variant: "info",
  });

  const { approve, loading: approveLoading } = useApproveCourse();
  const { ban, loading: banLoading } = useBanCourse();

  useEffect(() => {
    if (course?.lessons) {
      const fetchLessonDetails = async () => {
        const updatedLessons = await Promise.all(
          course.lessons!.map(async (lesson) => {
            try {
              const detail = await getLessonById(lesson.id);
              return detail || lesson;
            } catch {
              return lesson;
            }
          }),
        );
        setLessonsWithItems(updatedLessons);
      };
      fetchLessonDetails();
    }
  }, [course]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">
            progress_activity
          </span>
          <span className="text-slate-600">Đang tải thông tin khóa học...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-4xl text-red-500">
          error
        </span>
        <p className="text-slate-600">Không tìm thấy khóa học</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "play_circle";
      case "TEXT":
        return "article";
      case "PDF":
        return "picture_as_pdf";
      case "PPT":
        return "co_present";
      default:
        return "description";
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "text-purple-600 bg-purple-100";
      case "TEXT":
        return "text-blue-600 bg-blue-100";
      case "PDF":
        return "text-red-600 bg-red-100";
      case "PPT":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  const handleViewItem = async (item: LessonItem) => {
    setLoadingView(true);
    setViewItem(item);
    try {
      const detail = await getLessonItemById(item.id);
      if (detail) {
        setViewItem(detail);
      }
    } catch (error) {
      console.error("Failed to fetch item detail", error);
    } finally {
      setLoadingView(false);
    }
  };

  const closeViewModal = () => {
    setViewItem(null);
  };

  const openBanModal = () => {
    setModalConfig({
      isOpen: true,
      type: "BAN",
      title: "Khóa/Từ chối khóa học",
      message: `Bạn có chắc chắn muốn khóa/từ chối khóa học "${course.name}"? Hành động này sẽ ẩn khóa học khỏi hệ thống.`,
      variant: "danger",
    });
  };

  const handleConfirmAction = async () => {
    if (!id || !modalConfig.type) return;

    try {
      if (modalConfig.type === "APPROVE") {
        await approve(id, "PUBLISHED");
        toast.success("Đã phê duyệt khóa học thành công");
      } else if (modalConfig.type === "BAN") {
        await ban(id);
        toast.success("Đã khóa khóa học thành công");
      }
      refetch();
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error(
        modalConfig.type === "APPROVE"
          ? "Phê duyệt thất bại"
          : "Khóa khóa học thất bại",
      );
    }
  };

  return (
    <div className="space-y-6 text-[#101518] p-8">
      <LoadingOverlay
        isLoading={approveLoading || banLoading}
        message="Đang xử lý..."
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/courses")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600">
              arrow_back
            </span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{course.name}</h1>
            <p className="text-sm text-slate-500 mt-1">Chi tiết khóa học</p>
          </div>
        </div>
        <div className="flex gap-2">
          {course.status !== "BANNED" && (
            <button
              onClick={openBanModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold hover:translate-y-[-2px] transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">block</span>
              Khóa / Từ chối
            </button>
          )}
        </div>
      </div>

      {/* Course Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="w-full md:w-80 aspect-video bg-slate-100 shrink-0">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">
                  image
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.status === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : course.status === "BANNED"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {course.status === "PUBLISHED"
                  ? "Đang hoạt động"
                  : course.status === "BANNED"
                    ? "Đã khóa"
                    : "Nháp"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.visibility === "PUBLIC"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {course.visibility === "PUBLIC" ? "Công khai" : "Riêng tư"}
              </span>
            </div>

            <p className="text-slate-600 mb-4 line-clamp-3">
              {course.description || "Chưa có mô tả"}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Số bài học</p>
                <p className="text-xl font-bold text-slate-900">
                  {course.lessons?.length || course.lessonCount || 0}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Giáo viên</p>
                <p className="text-sm font-medium text-slate-900">
                  {course.teacher
                    ? `${course.teacher.firstName} ${course.teacher.lastName}`
                    : course.teacherName || "N/A"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Cập nhật</p>
                <p className="text-sm font-medium text-slate-900">
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Nội dung khóa học
          </h2>
        </div>

        {lessonsWithItems && lessonsWithItems.length > 0 ? (
          <div className="space-y-4">
            {lessonsWithItems.map((lesson, index) => (
              <div
                key={lesson.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                {/* Lesson Header */}
                <div className="bg-slate-50 px-4 py-3 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lesson.lessonItems?.length || 0} nội dung
                    </p>
                  </div>
                </div>

                {/* Lesson Items */}
                {lesson.lessonItems && lesson.lessonItems.length > 0 && (
                  <div className="divide-y divide-slate-100">
                    {lesson.lessonItems.map(
                      (item: LessonItem, itemIndex: number) => (
                        <div
                          key={item.id}
                          onClick={() => handleViewItem(item)}
                          className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div
                            className={`size-8 rounded-lg flex items-center justify-center ${getItemTypeColor(item.type)}`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {getItemTypeIcon(item.type)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.type}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {itemIndex + 1}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
              menu_book
            </span>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Chưa có bài học nào
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Khóa học này chưa có nội dung nào được thêm vào.
            </p>
          </div>
        )}
      </div>

      {/* View Item Modal - REUSED from TeacherCourseDetailPage */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeViewModal}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">
                  {getItemTypeIcon(viewItem.type)}
                </span>
                {viewItem.title}
              </h3>
              <button
                onClick={closeViewModal}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">
                  close
                </span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {loadingView ? (
                <div className="flex justify-center py-8">
                  <span className="material-symbols-outlined animate-spin text-3xl text-blue-600">
                    progress_activity
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      Mô tả
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {viewItem.description || "Không có mô tả"}
                    </p>
                  </div>

                  {viewItem.content && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">
                        Nội dung
                      </h4>
                      {viewItem.type === "TEXT" ? (
                        <div className="prose prose-sm max-w-none">
                          {viewItem.content.textContent ||
                            "Không có nội dung văn bản"}
                        </div>
                      ) : viewItem.content.resourceUrl ? (
                        <div className="space-y-3 w-max-8xl">
                          {viewItem.type === "VIDEO" ? (
                            <video
                              src={viewItem.content.resourceUrl}
                              controls
                              className="w-full rounded-lg bg-black aspect-video"
                            />
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-white">
                                <div
                                  className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${getItemTypeColor(
                                    viewItem.type,
                                  )}`}
                                >
                                  <span className="material-symbols-outlined text-2xl">
                                    {getItemTypeIcon(viewItem.type)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">
                                    {viewItem.title}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {viewItem.content.fileSize
                                      ? `${(
                                          viewItem.content.fileSize /
                                          1024 /
                                          1024
                                        ).toFixed(2)} MB`
                                      : "File tài liệu"}
                                  </p>
                                </div>
                                <a
                                  href={viewItem.content.resourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">
                                    open_in_new
                                  </span>
                                </a>
                              </div>
                              {viewItem.type === "PDF" && (
                                <div className="flex flex-col gap-3">
                                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 h-[800px] shadow-sm">
                                    <iframe
                                      src={viewItem.content.resourceUrl}
                                      className="w-full h-full"
                                      title="PDF Preview"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">
                          Chưa có nội dung file
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        isLoading={banLoading || approveLoading}
        confirmLabel={modalConfig.type === "APPROVE" ? "Phê duyệt" : "Khóa"}
      />
    </div>
  );
};

export default AdminCourseDetailPage;
