import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStudentCourses } from "../../hooks/useCourses";
import PaginationControl from "@/components/common/PaginationControl";

const StudentMyCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "in_progress" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOption, setSortOption] = useState("createdAt:desc");
  const [pageNo, setPageNo] = useState(0);
  const pageSize = 12; // Adjust as needed

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPageNo(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Determine completed status based on tab
  const completedStatus = useMemo(() => {
    if (activeTab === "in_progress") return false;
    if (activeTab === "completed") return true;
    return undefined;
  }, [activeTab]);

  // Call API with useStudentCourses hook with dynamic params
  const {
    data: coursesData,
    isLoading: loading,
    error,
    refetch,
  } = useStudentCourses({
    pageNo,
    pageSize,
    sorts: sortOption,
    keyword: debouncedSearch,
    completed: completedStatus,
  });

  const courses = coursesData?.items || null;
  const totalPages = coursesData?.totalPage || 0;
  const totalElements = coursesData?.totalElement || 0;

  // Handle tab change
  const handleTabChange = (tab: "all" | "in_progress" | "completed") => {
    setActiveTab(tab);
    setPageNo(0); // Reset to first page on tab change
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setPageNo(0);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageNo(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && !courses) {
    return (
      <div className="max-w-6xl mx-auto px-0 md:px-8 py-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">
              progress_activity
            </span>
            <span className="text-slate-600">Đang tải khóa học...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !courses) {
    return (
      <div className="max-w-6xl mx-auto px-0 md:px-8 py-4">
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
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-8 py-4">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="text-[#111518] text-xl md:text-3xl lg:text-4xl font-black tracking-tight">
          Khóa học của tôi
        </h2>
        <span className="text-sm text-slate-500">
          {totalElements || 0} khóa học
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-6 md:mb-8 border-b border-slate-200">
        <div className="flex flex-wrap gap-2 md:gap-8">
          <button
            onClick={() => handleTabChange("all")}
            className={`flex flex-col items-center justify-center pb-3 pt-4 px-2 transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "border-b-4 border-[#1E90FF] color-primary"
                : "border-b-4 border-transparent text-slate-500 hover:text-[#1E90FF]"
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Tất cả</p>
          </button>
          <button
            onClick={() => handleTabChange("in_progress")}
            className={`flex flex-col items-center justify-center pb-3 pt-4 px-2 transition-colors whitespace-nowrap ${
              activeTab === "in_progress"
                ? "border-b-4 border-[#1E90FF] color-primary"
                : "border-b-4 border-transparent text-slate-500 hover:text-[#1E90FF]"
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Đang học</p>
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`flex flex-col items-center justify-center pb-3 pt-4 px-2 transition-colors whitespace-nowrap ${
              activeTab === "completed"
                ? "border-b-4 border-[#1E90FF] color-primary"
                : "border-b-4 border-transparent text-slate-500 hover:text-[#1E90FF]"
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Đã hoàn thành</p>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="flex-1 w-full">
          <label className="block mb-1.5 md:mb-2">
            <span className="text-[#111518] text-sm font-semibold">
              Tìm kiếm
            </span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[#111518] focus:ring-2 focus:ring-[#27A4F2] focus:border-[#27A4F2] outline-none transition-all text-sm"
              placeholder="Tìm kiếm theo tên khóa học, giảng viên..."
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <label className="block mb-1.5 md:mb-2">
            <span className="text-[#111518] text-sm font-semibold">
              Sắp xếp theo
            </span>
          </label>
          <div className="relative">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full appearance-none pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-[#111518] focus:ring-2 focus:ring-[#27A4F2] focus:border-[#27A4F2] outline-none transition-all cursor-pointer text-sm"
            >
              <option value="createdAt:desc">Mới nhất</option>
              <option value="createdAt:asc">Cũ nhất</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {loading && !courses
          ? // Skeleton loading if initial load
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 h-[320px] animate-pulse"
              >
                <div className="bg-slate-200 h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))
          : courses?.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-video">
                  <div
                    className="w-full h-full bg-center bg-cover bg-slate-100"
                    style={{
                      backgroundImage: `url("${course.thumbnailUrl}")`,
                    }}
                  >
                    {!course.thumbnailUrl && (
                      <div className="w-full md:w-80 aspect-video bg-slate-100 shrink-0">
                        <img
                          src="/img/book.png"
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      course.status === "PUBLISHED"
                        ? "bg-green-500"
                        : course.status === "DRAFT"
                          ? "bg-yellow-500"
                          : "bg-slate-500"
                    }`}
                  >
                    {course.status === "PUBLISHED"
                      ? "Đang mở"
                      : course.status === "DRAFT"
                        ? "Bản nháp"
                        : course.status || "Khóa học"}
                  </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h3 className="text-[#111518] text-base font-bold leading-tight mb-2 line-clamp-2">
                    {course.name}
                  </h3>

                  {/* Teacher & School Info */}
                  <div className="flex flex-col gap-1 mb-3 text-sm text-slate-500">
                    {course.teacherName && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">
                          person
                        </span>
                        <span>{course.teacherName}</span>
                      </div>
                    )}
                    {course.schoolName && (
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">
                          school
                        </span>
                        <span>{course.schoolName}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress & Dates */}
                  <div className="flex flex-col gap-2 mb-4 mt-auto">
                    {course.progressPercent !== undefined && (
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Tiến độ</span>
                          <span className="font-medium color-primary">
                            {course.progressPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full color-primary-bg rounded-full transition-all duration-500"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        calendar_month
                      </span>
                      {course.completedAt ? (
                        <span>
                          Hoàn thành: {formatDate(course.completedAt)}
                        </span>
                      ) : course.enrolledAt ? (
                        <span>Tham gia: {formatDate(course.enrolledAt)}</span>
                      ) : (
                        <span>Cập nhật: {formatDate(course.updatedAt)}</span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/student/courses/${course.id}/learn`}
                    className="w-full py-2.5 md:py-3 color-primary-bg text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    Vào học
                    <span className="material-symbols-outlined text-sm">
                      play_circle
                    </span>
                  </Link>
                </div>
              </div>
            ))}

        {(!courses || courses.length === 0) && !loading && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2">
              school
            </span>
            <p>Không tìm thấy khóa học nào</p>
            {(searchQuery || activeTab !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                  setPageNo(0);
                }}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationControl
            currentPage={pageNo + 1}
            totalPages={totalPages}
            onPageChange={(page) => handlePageChange(page - 1)}
            disablePageSizeSelect
          />
        </div>
      )}
    </div>
  );
};

export default StudentMyCoursesPage;
