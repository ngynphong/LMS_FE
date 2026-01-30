import { useState } from "react";
import Breadcrumb from "../../components/courses/Breadcrumb";
import FilterSidebar from "../../components/courses/FilterSidebar";
import CourseCard from "../../components/courses/CourseCard";
import Pagination from "../../components/courses/Pagination";
import { useCourses } from "../../hooks/useCourses";
import { FaSearch } from "react-icons/fa";

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const coursesPerPage = 6;

  const { data, loading, error } = useCourses({
    pageNo: currentPage - 1, // API is 0-indexed
    pageSize: coursesPerPage,
    keyword: searchQuery,
    sorts: ["createdAt:desc"], // Correct: array of strings
    status: "PUBLISHED", // Public courses should be published
    visibility: "PUBLIC", // And public
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const courses = data?.data?.items || [];
  const totalCourses = data?.data?.totalElement || 0;
  const totalPages = data?.data?.totalPage || 0;

  return (
    <div className="w-full bg-white">
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
                        image={course.thumbnailUrl || ""}
                        category={course.schoolName || "Khóa học"}
                        duration="N/A" // API doesn't return duration yet
                        rating={5} // Placeholder
                        reviews={0} // Placeholder
                        instructor={course.teacherName}
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
    </div>
  );
};

export default CoursesPage;
