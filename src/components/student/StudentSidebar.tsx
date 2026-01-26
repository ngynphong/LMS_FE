import { Link, useLocation } from 'react-router-dom';
import { 
  FaCertificate, FaCalendar, 
  FaEnvelope, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import { MdDashboard, MdLibraryBooks } from 'react-icons/md';
import { IoSchool } from 'react-icons/io5';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/student/dashboard', icon: <MdDashboard className="text-lg" />, label: 'Tổng quan' },
  { path: '/student/my-courses', icon: <MdLibraryBooks className="text-lg" />, label: 'Khóa học của tôi' },
  { path: '/student/schedule', icon: <FaCalendar className="text-lg" />, label: 'Lịch học' },
  { path: '/student/messages', icon: <FaEnvelope className="text-lg" />, label: 'Tin nhắn' },
  { path: '/student/certificates', icon: <FaCertificate className="text-lg" />, label: 'Chứng chỉ' },
  { path: '/student/settings', icon: <FaCog className="text-lg" />, label: 'Cài đặt' }
];

const StudentSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // TODO: Call logout API
    console.log('Logging out...');
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo */}
      <Link to="/" className="p-4 flex items-center gap-3">
        <div className="bg-[#0077BE] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0077BE]/20">
          <IoSchool className="text-xl" />
        </div>
        <span className="text-xl font-black tracking-tight text-gray-900">Edu-Lms</span>
      </Link>
      {/* User Profile Card */}
        <Link 
          to="/student/profile"
          className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#0077BE]/20 flex items-center justify-center text-[#0077BE] text-xs font-bold">
              NV
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Nguyễn Văn A</p>
              <p className="text-[10px] text-gray-500 truncate">Học viên Premium</p>
            </div>
          </div>
        </Link>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center text-sm gap-3 px-6 py-3.5 transition-all ${
                  isActive(item.path)
                    ? 'text-[#0077BE] bg-[#0077BE]/5 border-r-4 border-[#0077BE] rounded-md font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0077BE]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center text-sm gap-3 px-6 py-3.5 text-red-500 hover:bg-red-50 transition-all w-full rounded-md"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Đăng xuất</span>
        </button>

        
      </div>
    </aside>
  );
};

export default StudentSidebar;
