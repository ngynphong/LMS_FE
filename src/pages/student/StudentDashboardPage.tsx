import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaBell,
  FaCalendar,
  FaCheckCircle,
  FaChartPie,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { notifications } from "../../data/notification";
import { useAuth } from "../../hooks/useAuth";
import { useStudentCourses } from "../../hooks/useCourses";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: coursesData } = useStudentCourses({
    pageNo: 0,
    pageSize: 3,
    sorts: "createdAt:desc",
  });

  const recentCourses = coursesData?.items || [];

  // Real stats data from user profile
  const statsData = [
    {
      icon: <FaBook />,
      label: "Khóa học đang học",
      value: user?.studentProfile?.stats?.totalCourses.toString() || "0",
    },
    {
      icon: <FaCheckCircle />,
      label: "Khóa học đã hoàn thành",
      value: user?.studentProfile?.stats?.completedCourses.toString() || "0",
    },
    {
      icon: <FaChartPie />,
      label: "Tiến độ trung bình",
      value: `${user?.studentProfile?.stats?.overallProgress || 0}%`,
    },
  ];

  const getNotificationColor = (color: string) => {
    const colors: Record<string, string> = {
      red: "bg-red-500 ring-red-50",
      blue: "color-primary ring-blue-50",
      green: "bg-green-500 ring-green-50",
      yellow: "bg-yellow-500 ring-yellow-50",
    };
    return colors[color] || "bg-gray-500 ring-gray-50";
  };

  const getNotificationTextColor = (color: string) => {
    const colors: Record<string, string> = {
      red: "text-red-500",
      blue: "color-primary",
      green: "text-green-500",
      yellow: "text-yellow-500",
    };
    return colors[color] || "text-gray-500";
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "☀️ Chào buổi sáng";
    } else if (hour >= 12 && hour < 18) {
      return "🌇 Chào buổi chiều";
    } else if (hour >= 18 && hour < 22) {
      return "🌆 Chào buổi tối";
    } else {
      return "🌕 Chúc ngủ ngon";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-8">
      {/* Left Column */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-900 text-2xl font-semibold leading-tight tracking-tight bg-blue-100 w-fit p-1 px-2 rounded-xl">
            {getGreeting()}, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 text-base font-normal">
            Bạn có 3 bài học cần hoàn thành hôm nay.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl p-4 lg:p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 color-primary/10 rounded-lg color-primary text-xl">
                  {stat.icon}
                </div>
                <p className="text-gray-600 text-sm font-medium truncate">
                  {stat.label}
                </p>
              </div>
              <p className="color-primary text-2xl lg:text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-gray-900 text-xl lg:text-[22px] font-bold tracking-tight">
              Tiến độ học tập
            </h2>
            <Link
              to="/my-courses"
              className="color-primary text-sm font-semibold hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                  <div
                    className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg h-32 w-full sm:h-24 sm:w-40 lg:w-44 shrink-0 shadow-sm"
                    style={{
                      backgroundImage: `url('${course.thumbnailUrl || "/img/book.png"}')`,
                    }}
                  />
                  <div className="flex flex-col flex-1 gap-3 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-900 text-lg font-bold line-clamp-1">
                          {course.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Giảng viên:{" "}
                          {course.teacherName ||
                            course.teacher?.firstName +
                              " " +
                              course.teacher?.lastName ||
                            "Unknown"}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="color-primary text-lg font-bold">
                          {course.progressPercent || 0}%
                        </p>
                        <p className="text-gray-500 text-xs text-nowrap">
                          hoàn thành
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full color-primary-bg rounded-full transition-all duration-500"
                        style={{ width: `${course.progressPercent || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      onClick={() => navigate(`/student/courses/${course.id}/learn`)}
                      className="w-full sm:w-auto px-6 py-2.5 color-primary-bg text-white text-sm font-bold rounded-lg hover:scale-105 transition-all cursor-pointer duration-300 whitespace-nowrap"
                    >
                      Tiếp tục học
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">Bạn chưa đăng ký khóa học nào.</p>
                <Link
                  to="/courses"
                  className="text-blue-600 hover:underline mt-2 inline-block font-medium"
                >
                  Khám phá khóa học ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FaBell className="color-primary" />
            <h2 className="text-gray-900 text-lg font-bold">
              Thông báo & Nhắc nhở
            </h2>
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
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${getNotificationTextColor(notif.color)}`}
                  >
                    {notif.type === "deadline" && "Hạn chót sắp tới"}
                    {notif.type === "interaction" && "Tương tác"}
                    {notif.type === "system" && "Hệ thống"}
                    {notif.type === "schedule" && "Lịch học"}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1 group-hover:color-primary transition-colors line-clamp-2">
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
        <div className="color-primary-bg rounded-xl p-6 text-white shadow-lg shadow-[#0077BE]/20">
          <p className="text-white/80 text-sm font-medium">
            Buổi học tiếp theo
          </p>
          <h3 className="text-xl font-bold mt-1">Kỹ năng thuyết trình</h3>
          <div className="flex items-center gap-2 mt-4 text-sm opacity-90">
            <FaCalendar className="text-sm" />
            <span>Ngày mai, 08:30 AM</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
            <MdLocationOn className="text-sm" />
            <span>Phòng Lab A2 - Lầu 3</span>
          </div>
          <button className="w-full mt-6 py-2 bg-white color-primary rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
            Xem chi tiết lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
