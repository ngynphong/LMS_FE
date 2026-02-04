import { useState, useEffect } from "react";
import Breadcrumb from "../../components/courses/Breadcrumb";
import FilterSidebar from "../../components/courses/FilterSidebar";
import CourseCard from "../../components/courses/CourseCard";
import Pagination from "../../components/courses/Pagination";
import {
  useCourses,
  useStudentCourses,
  useEnrollCourse,
} from "../../hooks/useCourses";
import { FaSearch } from "react-icons/fa";
import { toast } from "@/components/common/Toast";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const coursesPerPage = 6;
  const navigate = useNavigate();

  const {
    data,
    isLoading: loading,
    error,
  } = useCourses({
    pageNo: currentPage - 1, // API is 0-indexed
    pageSize: coursesPerPage,
    keyword: searchQuery,
    sorts: ["createdAt:desc"], // Correct: array of strings
    status: "PUBLISHED", // Public courses should be published
    visibility: "PUBLIC", // And public
  });

  // Student Enrollment Data
  const { data: enrolledCoursesData } = useStudentCourses({
    pageSize: 1000, // Fetch all
  });
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (enrolledCoursesData?.items) {
      setEnrolledCourseIds(new Set(enrolledCoursesData.items.map((c) => c.id)));
    }
  }, [enrolledCoursesData]);

  const { mutateAsync: enroll, isPending: enrolling } = useEnrollCourse();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [enrollmentCode, setEnrollmentCode] = useState("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCourseClick = (courseId: string) => {
    if (enrolledCourseIds.has(courseId)) {
      navigate(`/courses/${courseId}`);
    } else {
      setSelectedCourseId(courseId);
      setEnrollmentCode("");
      setShowEnrollModal(true);
    }
  };

  const handleEnrollSubmit = async () => {
    if (!selectedCourseId || !enrollmentCode) return;
    try {
      await enroll({
        courseId: selectedCourseId,
        data: { enrollmentCode },
      });
      toast.success("Tham gia khóa học thành công!");
      setShowEnrollModal(false);
      // Navigate to detail page
      navigate(`/courses/${selectedCourseId}`);
    } catch (err) {
      toast.error("Mã tham gia không hợp lệ hoặc hết hạn.");
    }
  };

  const courses = data?.data?.items || [];
  const totalCourses = data?.data?.totalElement || 0;
  const totalPages = data?.data?.totalPage || 0;

  return (
    <div className="w-full bg-white relative">
      <main className="max-w-[1280px] mx-auto w-full px-4 sm:px-10 py-6">
        <Breadcrumb />

        {/* Search Area */}
        <div className="py-6">
          <div className="max-w-3xl mx-auto">
            <label className="flex flex-col w-full h-14 relative group">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm group-focus-within:ring-2 ring-[#1E90FF] transition-all">
                <div className="text-gray-500 flex border-none bg-white items-center justify-center pl-5 rounded-l-xl border-r-0">
                  <FaSearch />
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 focus:outline-0 focus:ring-0 border-none bg-white placeholder:text-gray-500 px-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
                  placeholder="Tìm kiếm khóa học bạn quan tâm..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <FilterSidebar />

          {/* Content Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900 text-2xl font-bold">
                Danh sách khóa học
              </h2>
              <span className="text-sm text-gray-500">
                Tìm thấy {totalCourses} khóa học
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
                  progress_activity
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                Đã có lỗi xảy ra khi tải danh sách khóa học.
              </div>
            ) : (
              <>
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.name}
                        thumbnailUrl={course.thumbnailUrl}
                        category={course.schoolName || "Khóa học"}
                        createdAt={course.createdAt}
                        instructor={course.teacherName}
                        onClick={() => handleCourseClick(course.id)}
                        isEnrolled={enrolledCourseIds.has(course.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    Không tìm thấy khóa học nào phù hợp.
                  </div>
                )}

                {/* Pagination */}
                {courses.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Tham gia khóa học
              </h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Vui lòng nhập mã tham gia được cung cấp bởi giảng viên để ghi danh
              vào khóa học này.
            </p>

            <div className="mb-6">
              <input
                type="text"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value)}
                placeholder="Nhập mã tham gia..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:translate-y-[-2px] transition-all duration-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleEnrollSubmit}
                disabled={enrolling || !enrollmentCode}
                className="px-4 py-2 text-sm font-bold text-white color-primary-bg hover:translate-y-[-2px] transition-all duration-300 rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {enrolling && (
                  <span className="material-symbols-outlined animate-spin text-sm">
                    progress_activity
                  </span>
                )}
                Tham gia ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
