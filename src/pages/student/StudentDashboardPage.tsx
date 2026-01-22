import { Link } from 'react-router-dom';
import { FaBook, FaClock, FaCertificate, FaBell, FaCalendar } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { notifications } from '../../data/notification';
import { coursesProgress } from '../../data/coursesData';

// Mock data
const statsData = [
  { icon: <FaBook />, label: 'Khóa học đang học', value: '4' },
  { icon: <FaClock />, label: 'Giờ học tuần này', value: '12h' },
  { icon: <FaCertificate />, label: 'Chứng chỉ đã đạt', value: '2' }
];

const StudentDashboardPage = () => {
  const getNotificationColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-500 ring-red-50',
      blue: 'bg-[#0077BE] ring-blue-50',
      green: 'bg-green-500 ring-green-50',
      yellow: 'bg-yellow-500 ring-yellow-50'
    };
    return colors[color] || 'bg-gray-500 ring-gray-50';
  };

  const getNotificationTextColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'text-red-500',
      blue: 'text-[#0077BE]',
      green: 'text-green-500',
      yellow: 'text-yellow-500'
    };
    return colors[color] || 'text-gray-500';
  };

  const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return '🌄 Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return '🌇 Good Afternoon';
  } else if (hour >= 18 && hour < 22) {
    return '🌆 Good Evening';
  } else {
    return '🌃 Good Night';
  }
};

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-900 text-2xl font-semibold leading-tight tracking-tight bg-blue-100 w-max p-1 px-2 rounded-xl">
            {getGreeting()}, Nguyễn Văn A!
          </h1>
          <p className="text-gray-600 text-base font-normal">
            Bạn có 3 bài học cần hoàn thành hôm nay.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex min-w-[180px] flex-1 flex-col gap-3 rounded-xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0077BE]/10 rounded-lg text-[#0077BE] text-xl">
                  {stat.icon}
                </div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
              <p className="text-[#0077BE] text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-gray-900 text-[22px] font-bold tracking-tight">
              Tiến độ học tập
            </h2>
            <Link to="/my-courses" className="text-[#0077BE] text-sm font-semibold hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {coursesProgress.map((course) => (
              <div
                key={course.id}
                className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
              >
                <div
                  className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg h-24 w-full md:w-44 shrink-0"
                  style={{ backgroundImage: `url('${course.thumbnail}')` }}
                />
                <div className="flex flex-col flex-1 gap-3 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900 text-lg font-bold">{course.title}</p>
                      <p className="text-gray-500 text-sm mt-1">Giảng viên: {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#0077BE] text-lg font-bold">{course.progress}%</p>
                      <p className="text-gray-500 text-xs">hoàn thành</p>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0077BE] rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <button className="w-full md:w-auto px-6 py-2.5 bg-[#0077BE] text-white text-sm font-bold rounded-lg hover:bg-[#0066a3] transition-colors">
                    Tiếp tục học
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FaBell className="text-[#0077BE]" />
            <h2 className="text-gray-900 text-lg font-bold">Thông báo & Nhắc nhở</h2>
          </div>
          <div className="flex flex-col gap-5">
            {notifications.map((notif, index) => (
              <div key={notif.id} className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-2.5 rounded-full ${getNotificationColor(notif.color)} ring-4 mt-2`}
                  />
                  {index < notifications.length - 1 && (
                    <div className="w-0.5 grow bg-gray-100 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className={`text-xs font-bold uppercase tracking-wider ${getNotificationTextColor(notif.color)}`}>
                    {notif.type === 'deadline' && 'Hạn chót sắp tới'}
                    {notif.type === 'interaction' && 'Tương tác'}
                    {notif.type === 'system' && 'Hệ thống'}
                    {notif.type === 'schedule' && 'Lịch học'}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-[#0077BE] transition-colors">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notif.time} • {notif.course}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Xem toàn bộ thông báo
          </button>
        </div>

        {/* Next Class */}
        <div className="bg-[#0077BE] rounded-xl p-6 text-white shadow-lg shadow-[#0077BE]/20">
          <p className="text-white/80 text-sm font-medium">Buổi học tiếp theo</p>
          <h3 className="text-xl font-bold mt-1">Kỹ năng thuyết trình</h3>
          <div className="flex items-center gap-2 mt-4 text-sm opacity-90">
            <FaCalendar className="text-sm" />
            <span>Ngày mai, 08:30 AM</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
            <MdLocationOn className="text-sm" />
            <span>Phòng Lab A2 - Lầu 3</span>
          </div>
          <button className="w-full mt-6 py-2 bg-white text-[#0077BE] rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
            Xem chi tiết lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
