import { useState } from 'react';
import Breadcrumb from '../../components/courses/Breadcrumb';
import FilterSidebar from '../../components/courses/FilterSidebar';
import CourseCard from '../../components/courses/CourseCard';
import Pagination from '../../components/courses/Pagination';
import coursesData from '../../data/coursesData';
import { FaSearch } from "react-icons/fa";

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const coursesPerPage = 6;

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = coursesData.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(coursesData.length / coursesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                Tìm thấy {coursesData.length} khóa học
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
