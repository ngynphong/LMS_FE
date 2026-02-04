import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useMyCourses,
  useCreateInviteCode,
  useDeleteCourse,
} from "../../hooks/useCourses";
import { toast } from "@/components/common/Toast";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import PaginationControl from "@/components/common/PaginationControl";

const CourseListPage = () => {
  const [filters, setFilters] = useState({
    pageNo: 1, // API is 1-indexed
    pageSize: 10,
    sorts: "createdAt:desc",
    keyword: "",
    status: "",
    visibility: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, keyword: searchTerm, pageNo: 1 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: coursesData,
    isLoading: loading,
    error,
    refetch,
  } = useMyCourses({
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
    visibility: filters.visibility === "all" ? undefined : filters.visibility,
  });

  const courses = coursesData?.items || [];
  const totalPages = coursesData?.totalPage || 0;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const { mutateAsync: createCode, isPending: creatingCode } =
    useCreateInviteCode();

  // Delete course state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const { mutateAsync: deleteCourse, isPending: deletingCourse } =
    useDeleteCourse();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pageNo: 1, // Reset to first page on filter change
    }));
  };

  const handleCreateCode = async () => {
    if (!selectedCourseId) return;
    try {
      const code = await createCode({
        courseId: selectedCourseId,
        data: { expirationInMinutes: 60 * 24 * 1 },
      }); // Default 7 days
      setCreatedCode(code);
      toast.success("Tạo mã mời thành công!");
    } catch (err) {
      toast.error("Tạo mã mời thất bại");
    }
  };

  const openInviteModal = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCreatedCode(null);
    setShowInviteModal(true);
  };

  const openDeleteModal = (courseId: string) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse(courseToDelete);
      toast.success("Xóa khóa học thành công");
      setShowDeleteModal(false);
      setCourseToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Không thể xóa khóa học. Vui lòng thử lại sau.");
    }
  };

  if (loading && !coursesData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">
            progress_activity
          </span>
          <span className="text-slate-600">Đang tải khóa học...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-4xl text-red-500">
          error
        </span>
        <p className="text-slate-600">Không thể tải danh sách khóa học</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const courseList = courses || [];

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101518] text-2xl font-bold tracking-tight">
            Khóa học của tôi
          </h1>
          <p className="text-[#5e7b8d] text-sm mt-1">
            Quản lý và xây dựng các khóa học của bạn
          </p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg color-primary-bg text-white text-sm font-bold shadow-sm hover:translate-y-[-2px] duration-300 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tạo khóa học mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
          <select
            value={filters.visibility}
            onChange={(e) => handleFilterChange("visibility", e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
          >
            <option value="all">Tất cả quyền</option>
            <option value="PUBLIC">Công khai</option>
            <option value="PRIVATE">Riêng tư</option>
          </select>
          <select
            value={filters.sorts}
            onChange={(e) => handleFilterChange("sorts", e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
          >
            <option value="createdAt:desc">Mới nhất</option>
            <option value="createdAt:asc">Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {courseList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
            school
          </span>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Bắt đầu tạo khóa học đầu tiên của bạn
          </p>
          <Link
            to="/teacher/courses/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0074bd] text-white text-sm font-bold"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tạo khóa học mới
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseList.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <div
                  className="w-full h-full bg-center bg-cover bg-slate-100"
                  style={{ backgroundImage: `url("${course.thumbnailUrl}")` }}
                >
                  {!course.thumbnailUrl && (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/img/book.png"
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${course.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {course.status === "PUBLISHED" ? "Công khai" : "Bản nháp"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      menu_book
                    </span>
                    {course.lessonCount || 0} bài học
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/teacher/courses/${course.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 hover:translate-y-[-2px] duration-300 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">
                      edit
                    </span>
                    Sửa
                  </Link>
                  <button
                    onClick={() => openInviteModal(course.id)}
                    className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 hover:translate-y-[-2px] duration-300 transition-all"
                    title="Tạo mã mời"
                  >
                    <span className="material-symbols-outlined text-sm">
                      key
                    </span>
                  </button>
                  <Link
                    to={`/teacher/courses/${course.id}`}
                    className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 hover:translate-y-[-2px] duration-300 transition-all"
                    title="Xem khóa học"
                  >
                    <span className="material-symbols-outlined text-sm">
                      visibility
                    </span>
                  </Link>
                  <button
                    onClick={() => openDeleteModal(course.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 hover:translate-y-[-2px] duration-300 transition-all"
                    title="Xóa khóa học"
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-8 pb-4">
        <PaginationControl
          currentPage={filters.pageNo}
          totalPages={totalPages}
          onPageChange={(page) => handleFilterChange("pageNo", String(page))}
          pageSize={filters.pageSize}
          onPageSizeChange={(size) =>
            handleFilterChange("pageSize", String(size))
          }
        />
      </div>

      {/* Invite Code Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Tạo mã tham gia
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Mã tham gia cho phép học viên tự ghi danh vào khóa học này. Mã mặc
              định có hiệu lực trong 1 ngày.
            </p>

            {createdCode ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-green-700 font-medium mb-1">
                  Mã tham gia của bạn:
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-green-800 tracking-wider">
                    {createdCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdCode);
                      toast.success("Đã sao chép mã!");
                    }}
                    className="p-2 hover:bg-green-100 rounded-full text-green-700"
                    title="Sao chép"
                  >
                    <span className="material-symbols-outlined text-sm">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-3xl">
                    vpn_key
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Đóng
              </button>
              {!createdCode && (
                <button
                  onClick={handleCreateCode}
                  disabled={creatingCode}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {creatingCode ? (
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">
                      add_circle
                    </span>
                  )}
                  Tạo mã mới
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCourse}
        title="Xóa khóa học"
        message="Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác và tất cả dữ liệu liên quan sẽ bị mất."
        confirmLabel="Xóa khóa học"
        cancelLabel="Hủy bỏ"
        isLoading={deletingCourse}
        variant="danger"
      />
    </div>
  );
};

export default CourseListPage;
