import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCourseDetail, useCourseStudents } from "../../hooks/useCourses";
import { getLessonById } from "../../services/lessonService";
import type { LessonItem, ApiLesson } from "../../types/learningTypes";
import PaginationControl from "../../components/common/PaginationControl";
import { useRequestBatchResetPassword } from "../../hooks/useBatchPasswordReset";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { toast } from "../../components/common/Toast";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { FaCircleNotch } from "react-icons/fa";
import { getInitials } from "@/utils/initialsName";

const TeacherCourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: course,
    isLoading: loading,
    error,
    refetch,
  } = useCourseDetail(id);

  const {
    data: studentsResponse,
    isLoading: studentsLoading,
    error: studentsError,
  } = useCourseStudents(id);

  const [lessonsWithItems, setLessonsWithItems] = useState<ApiLesson[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const requestResetMutation = useRequestBatchResetPassword();

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
      <LoadingOverlay isLoading={true} message="Đang tải thông tin khóa học..." />
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
          onClick={() => refetch()}
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

  const handleViewItem = (lessonId: string, item: LessonItem) => {
    navigate(`/teacher/courses/${id}/lessons/${lessonId}/items/${item.id}`);
  };

  const students = studentsResponse?.data || [];
  const totalElements = students.length;
  const totalPages = Math.ceil(totalElements / pageSize);

  const currentStudents = students.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmails(currentStudents.map((s) => s.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectStudent = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleRequestReset = () => {
    if (selectedEmails.length === 0) return;
    setIsConfirmOpen(true);
  };

  const executeRequestReset = () => {
    requestResetMutation.mutate(
      { userEmails: selectedEmails },
      {
        onSuccess: () => {
          toast.success("Đã gửi yêu cầu reset mật khẩu thành công!");
          setSelectedEmails([]);
          setIsConfirmOpen(false);
        },
        onError: (err) => {
          toast.error("Lỗi: " + err.message);
          setIsConfirmOpen(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/teacher/courses")}
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
        <Link
          to={`/teacher/courses/${id}/edit`}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
          Chỉnh sửa
        </Link>
      </div>

      {/* Course Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div
            className="w-full md:w-80 aspect-video bg-center bg-cover bg-slate-100 shrink-0"
            style={{ backgroundImage: `url("${course.thumbnailUrl}")` }}
          >
            {!course.thumbnailUrl && (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/img/default-course.jpg"
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
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
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {course.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
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
                  {course.updatedAt
                    ? new Date(course.updatedAt).toLocaleDateString("vi-VN")
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
          <Link
            to={`/teacher/courses/${id}/edit`}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm bài học
          </Link>
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
                          onClick={() => handleViewItem(lesson.id, item)}
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
              Bắt đầu thêm bài học cho khóa học này
            </p>
            <Link
              to={`/teacher/courses/${id}/edit`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Thêm bài học
            </Link>
          </div>
        )}
      </div>

      {/* Students Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900">
              Danh sách học viên
            </h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
              {studentsResponse?.data?.length || 0} học viên
            </span>
          </div>
          {selectedEmails.length > 0 && (
            <button
              onClick={handleRequestReset}
              disabled={requestResetMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium text-sm hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                lock_reset
              </span>
              {requestResetMutation.isPending
                ? "Đang gửi..."
                : "Yêu cầu Reset Mật khẩu"}{" "}
              ({selectedEmails.length})
            </button>
          )}
        </div>

        {studentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="animate-spin text-2xl text-blue-600">
              <FaCircleNotch />
            </span>
          </div>
        ) : studentsError ? (
          <div className="text-center py-8 text-red-500">
            Lỗi khi tải danh sách học viên
          </div>
        ) : currentStudents.length > 0 ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={
                  currentStudents.length > 0 &&
                  currentStudents.every((s) => selectedEmails.includes(s.email))
                }
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-700">
                Chọn tất cả trên trang này
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(student.email)}
                    onChange={() => handleSelectStudent(student.email)}
                    className="w-4 h-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  {student.imgUrl ? (
                    <img
                      src={student.imgUrl}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-12 h-12 rounded-full object-cover bg-slate-100 border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600">
                        {getInitials(student.firstName + " " + student.lastName)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {student.email}
                    </p>
                  </div>
                  {student.studentProfile?.schoolName && (
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        Trường
                      </p>
                      <p className="text-xs text-slate-700 truncate max-w-[120px]">
                        {student.studentProfile.schoolName}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalElements > 0 && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  pageSizeOptions={[4, 10, 20, 50]}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
              group
            </span>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Chưa có học viên
            </h3>
            <p className="text-sm text-slate-500">
              Khóa học này hiện chưa có học viên nào tham gia.
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeRequestReset}
        title="Yêu cầu Reset Mật khẩu"
        message={`Gửi yêu cầu reset mật khẩu cho ${selectedEmails.length} học viên?`}
        confirmLabel="Gửi yêu cầu"
        cancelLabel="Hủy"
        isLoading={requestResetMutation.isPending}
        variant="warning"
      />
    </div>
  );
};

export default TeacherCourseDetailPage;
