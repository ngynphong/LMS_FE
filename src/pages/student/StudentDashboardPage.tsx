import { Link, useNavigate } from "react-router-dom";
import { FaBook, FaBell, FaCheckCircle, FaChartPie } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useStudentCourses } from "@/hooks/useCourses";
import {
  useNotifications,
  useMarkNotificationRead,
} from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MdOutlineSportsBaseball } from "react-icons/md";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: coursesData } = useStudentCourses({
    pageNo: 0,
    pageSize: 3,
    sorts: "createdAt:desc",
  });

  const { data: notificationData } = useNotifications(0, 20, "createdAt:desc");
  const markRead = useMarkNotificationRead();

  const recentCourses = coursesData?.items || [];
  const notifications =
    notificationData?.pages.flatMap((page: any) => {
      return (
        page.content ||
        page.data ||
        page.items ||
        (Array.isArray(page) ? page : [])
      );
    }) || [];

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

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      DEADLINE: "bg-red-500 ring-red-50",
      INTERACTION: "color-primary-bg ring-blue-50",
      SYSTEM: "bg-green-500 ring-green-50",
      SCHEDULE: "bg-yellow-500 ring-yellow-50",
    };
    return colors[type] || "color-primary-bg ring-blue-50";
  };

  const getNotificationTextColor = (type: string) => {
    const colors: Record<string, string> = {
      DEADLINE: "text-red-500",
      INTERACTION: "color-primary",
      SYSTEM: "text-green-500",
      SCHEDULE: "text-yellow-500",
    };
    return colors[type] || "color-primary";
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
                      backgroundImage: `url('${course.thumbnailUrl || "/img/default-course.jpg"}')`,
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
                      onClick={() =>
                        navigate(`/student/courses/${course.id}/learn`)
                      }
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

        {/* Live Quiz Quick Access Widget */}
        <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-lg text-white border-0 mt-2 relative overflow-hidden group hover:shadow-xl transition-all">
          {/* Background glow animation */}
          <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-[-150%] group-hover:animate-shine"></div>

          <div className="flex items-center gap-6 mb-4 sm:mb-0 z-10 w-full sm:w-auto">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm">
              <span className="text-4xl animate-bounce-slow">
                <MdOutlineSportsBaseball />
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1 drop-shadow-md">
                CodeQuiz Live!
              </h3>
              <p className="text-white/90 font-medium text-sm sm:text-base">
                Tham gia trận chiến tri thức, đua top realtime.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/student/live-quiz/join")}
            className="z-10 w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-50 focus:ring-4 focus:ring-white/30 font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 group-hover:-translate-y-1"
          >
            Nhập mã PIN
          </button>
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
            {notifications.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                Bạn chưa có thông báo nào.
              </div>
            )}
            {notifications.slice(0, 4).map((notif, index) => (
              <div
                key={notif.id}
                className={`flex gap-4 group cursor-pointer transition-colors p-2 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/50 ${!notif.read ? "bg-blue-50/30" : ""}`}
                onClick={() => {
                  if (!notif.read) markRead.mutate(notif.id);
                  if (notif.link) navigate(notif.link);
                }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`size-2.5 rounded-full ${getNotificationColor(notif.type)} ring-4 mt-2`}
                  />
                  {index < Math.min(notifications.length, 4) - 1 && (
                    <div className="w-0.5 grow bg-gray-100 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[11px] font-bold uppercase tracking-wider ${getNotificationTextColor(notif.type)}`}
                    >
                      {notif.type === "DEADLINE" && "Hạn chót sắp tới"}
                      {notif.type === "INTERACTION" && "Tương tác"}
                      {notif.type === "SYSTEM" && "Hệ thống"}
                      {notif.type === "SCHEDULE" && "Lịch học"}
                      {![
                        "DEADLINE",
                        "INTERACTION",
                        "SYSTEM",
                        "SCHEDULE",
                      ].includes(notif.type) && notif.type}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 group-hover:color-primary transition-colors line-clamp-2 ${!notif.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                  >
                    {notif.title || notif.content}
                  </p>
                  {notif.title && notif.content && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {notif.content}
                    </p>
                  )}
                </div>
                {!notif.read && (
                  <div className="shrink-0 size-2 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Xem toàn bộ thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
