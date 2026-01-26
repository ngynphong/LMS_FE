import { Link } from 'react-router-dom';
import CourseCard from '../../components/courses/CourseCard';
import courses from '../../data/courses';

const CourseListPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101518] text-2xl font-bold tracking-tight">Khóa học của tôi</h1>
          <p className="text-[#5e7b8d] text-sm mt-1">Quản lý và xây dựng các khóa học của bạn</p>
        </div>
        <Link
          to="/teacher/courses/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0074bd] text-white text-sm font-bold shadow-sm hover:bg-[#0074bd]/90 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tạo khóa học mới
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
          />
        </div>
        <select className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]">
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đang bán</option>
          <option value="draft">Bản nháp</option>
        </select>
        <select className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]">
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="popular">Phổ biến nhất</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Tổng khóa học</p>
          <p className="text-[#101518] text-2xl font-bold mt-1">{courses.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Đang bán</p>
          <p className="text-green-600 text-2xl font-bold mt-1">{courses.filter(c => c.status === 'published').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Bản nháp</p>
          <p className="text-amber-600 text-2xl font-bold mt-1">{courses.filter(c => c.status === 'draft').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-[#5e7b8d] text-xs font-medium">Tổng học viên</p>
          <p className="text-[#0074bd] text-2xl font-bold mt-1">{courses.reduce((sum, c) => sum + c.studentCount, 0)}</p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} variant="teacher" />
        ))}
      </div>
    </div>
  );
};

export default CourseListPage;
