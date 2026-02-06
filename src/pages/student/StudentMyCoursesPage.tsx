import { useState, useMemo, useEffect } from "react";
import { useStudentCourses } from "../../hooks/useCourses";
import PaginationControl from "@/components/common/PaginationControl";
import StudentCourseCard, {
  StudentCourseCardSkeleton,
} from "@/components/student/StudentCourseCard";
import LoadingOverlay from "@/components/common/LoadingOverlay";

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageNo(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && !courses) {
    return <LoadingOverlay isLoading={loading} message="Đang tải khoá học" />;
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
        <div
          className="flex flex-wrap gap-2 md:gap-8"
          role="tablist"
          aria-label="Bộ lọc khóa học"
        >
          <button
            onClick={() => handleTabChange("all")}
            role="tab"
            aria-selected={activeTab === "all"}
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
            role="tab"
            aria-selected={activeTab === "in_progress"}
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
            role="tab"
            aria-selected={activeTab === "completed"}
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
              <StudentCourseCardSkeleton key={i} />
            ))
          : courses?.map((course) => (
              <StudentCourseCard key={course.id} course={course} />
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
