import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyCourses } from "../../hooks/useCourses";

const CourseListPage = () => {
  const [filters, setFilters] = useState({
    pageNo: 0,
    pageSize: 10,
    sorts: "createdAt:desc",
    keyword: "",
    status: "",
    visibility: "",
  });

  const {
    data: courses,
    loading,
    error,
    refetch,
  } = useMyCourses({
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
    visibility: filters.visibility === "all" ? undefined : filters.visibility,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pageNo: 0, // Reset to first page on filter change
    }));
  };

  if (loading) {
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
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const courseList = courses || [];
  const publishedCount = courseList.filter(
    (c) => c.status === "PUBLISHED",
  ).length;
  const draftCount = courseList.filter((c) => c.status === "DRAFT").length;

  return (
    <div className="space-y-6">
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
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="PUBLISHED">Đã xuất bản</option>
          <option value="DRAFT">Bản nháp</option>
        </select>
        <select
          value={filters.visibility}
          onChange={(e) => handleFilterChange("visibility", e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
        >
          <option value="all">Tất cả quyền</option>
          <option value="PUBLIC">Công khai</option>
          <option value="PRIVATE">Riêng tư</option>
        </select>
        <select
          value={filters.sorts}
          onChange={(e) => handleFilterChange("sorts", e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
        >
          <option value="createdAt:desc">Mới nhất</option>
          <option value="createdAt:asc">Cũ nhất</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Tổng khóa học</p>
          <p className="text-[#101518] text-2xl font-bold mt-1">
            {courseList.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Công khai</p>
          <p className="text-green-600 text-2xl font-bold mt-1">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Bản nháp</p>
          <p className="text-amber-600 text-2xl font-bold mt-1">{draftCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Tổng bài học</p>
          <p className="text-[#0074bd] text-2xl font-bold mt-1">
            {courseList.reduce((sum, c) => sum + (c.lessonCount || 0), 0)}
          </p>
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
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                )}
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
                    Chỉnh sửa
                  </Link>
                  <Link
                    to={`/teacher/courses/${course.id}`}
                    className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 hover:translate-y-[-2px] duration-300 transition-all"
                    title="Xem khóa học"
                  >
                    <span className="material-symbols-outlined text-sm">
                      visibility
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
