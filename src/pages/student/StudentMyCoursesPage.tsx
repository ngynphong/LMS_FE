import { useState } from "react";
import { Link } from "react-router-dom";
import { studentCourses } from "../../data/studentCourses";

const StudentMyCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<
    "in_progress" | "completed" | "favorite"
  >("in_progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");

  const getFilteredCourses = () => {
    let filtered = studentCourses;

    // Filter by tab
    if (activeTab === "in_progress") {
      filtered = filtered.filter((c) => c.status === "in_progress");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((c) => c.status === "completed");
    } else if (activeTab === "favorite") {
      // Assuming 'favorite' is a property or status, here using status for simplicity based on provided data
      filtered = filtered.filter((c) => c.status === "favorite");
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const courses = getFilteredCourses();

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-8 py-4">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="text-[#111518] text-xl md:text-3xl lg:text-4xl font-black tracking-tight">
          Khóa học của tôi
        </h2>
      </div>

      {/* Tabs */}
      <div className="mb-6 md:mb-8 border-b border-slate-200">
        <div className="flex flex-wrap gap-2 md:gap-8">
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`flex flex-col items-center justify-center pb-3 pt-4 px-2 transition-colors whitespace-nowrap ${
              activeTab === "in_progress"
                ? "border-b-4 border-b-color-primary color-primary"
                : "border-b-4 border-transparent text-slate-500 hover:text-[#111518]"
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Đang học</p>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex flex-col items-center justify-center pb-3 pt-4 px-2 transition-colors whitespace-nowrap ${
              activeTab === "completed"
                ? "border-b-4 border-b-color-primary color-primary"
                : "border-b-4 border-transparent text-slate-500 hover:text-[#111518]"
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Đã hoàn thành</p>
          </button>
          <button
            onClick={() => setActiveTab("favorite")}
            className={`flex flex-col items-center justify-center pb-3 pt-4 px-2 transition-colors whitespace-nowrap ${
              activeTab === "favorite"
                ? "border-b-4 border-b-color-primary color-primary"
                : "border-b-4 border-transparent text-slate-500 hover:text-[#111518]"
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Yêu thích</p>
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
              placeholder="Tìm kiếm khóa học..."
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
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-[#111518] focus:ring-2 focus:ring-[#27A4F2] focus:border-[#27A4F2] outline-none transition-all cursor-pointer text-sm"
            >
              <option value="recent">Gần đây nhất</option>
              <option value="progress_desc">Tiến độ: Cao đến thấp</option>
              <option value="progress_asc">Tiến độ: Thấp đến cao</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative aspect-video">
              <div
                className="w-full h-full bg-center bg-cover"
                style={{ backgroundImage: `url("${course.thumbnail}")` }}
              ></div>
              <span className="absolute top-3 left-3 color-primary-bg text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                {course.category}
              </span>
            </div>
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <h3 className="text-[#111518] text-base font-bold leading-tight mb-3 line-clamp-2">
                {course.title}
              </h3>

              <div className="mb-4 mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 text-xs font-medium">
                    Tiến độ hoàn thành
                  </span>
                  <span className="color-primary text-xs font-bold">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="color-primary-bg h-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <Link
                to={`/student/courses/${course.id}`}
                className="w-full py-2.5 md:py-3 color-primary-bg text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Tiếp tục học
                <span className="material-symbols-outlined text-sm">
                  play_circle
                </span>
              </Link>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2">
              school
            </span>
            <p>Không tìm thấy khóa học nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMyCoursesPage;
