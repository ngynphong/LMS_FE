import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/teacher/dashboard', icon: 'dashboard', label: 'Tổng quan' },
  { path: '/teacher/courses', icon: 'book_2', label: 'Khóa học' },
  { path: '/teacher/questions', icon: 'database', label: 'Ngân hàng câu hỏi' },
  { path: '/teacher/exams', icon: 'description', label: 'Đề thi' },
  { path: '/teacher/students', icon: 'group', label: 'Học viên' },
  { path: '/teacher/reports', icon: 'analytics', label: 'Báo cáo' },
  { path: '/teacher/settings', icon: 'settings', label: 'Cài đặt' }
];

const TeacherSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#dbe2e6] flex flex-col justify-between py-6 z-50">
      <div className="flex flex-col gap-8">
        {/* Profile Section */}
        <div className="px-6 flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#0b8eda]/20"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxzHGBuvCbcbT7_cVmyqt_jJ7NCJw2mxPGD66bp0OtXUigvQ8TGNcmtIZ5DZtmQaCXqeSV3YtcXZnQJrjarq2RE70oBSFDMaehH6RJw-5HZMewr30nWv8Dnu8AEITbjgPtPSa129dlh7aDtMW6nkazmBKzyHiKYSEQscd5sUh4NhVAgJSkwvETf9GuI1R-0pv8qqI0dR53X2sxOIQ6h_3Itp75g0oZP4sqs63EejNd-_fsFOZxYcevr0iU2NP9F5s42xDxXBtpTKQx")`
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-[#111518] text-base font-bold leading-tight">Edu-LMS</h1>
            <p className="text-[#607b8a] text-xs font-medium">Giảng viên</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                isActive(item.path)
                  ? 'text-[#0077BE] bg-[#0077BE]/5 border-r-4 border-[#0077BE]'
                  : 'text-[#607b8a] hover:bg-gray-100'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'FILL' : ''}`}>
                {item.icon}
              </span>
              <p className={`text-sm ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </p>
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-6 flex flex-col gap-4">
        {/* Create Course Button */}
        <button className="w-full bg-[#0b8eda] hover:bg-[#0b8eda]/90 text-white text-sm font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-all">
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Tạo khóa học mới
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center text-sm gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 transition-all w-full rounded-md"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
