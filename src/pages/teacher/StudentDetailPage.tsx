import { Link, useParams } from 'react-router-dom';

// Mock student data
const mockStudent = {
  id: '1',
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  status: 'active' as const,
  cohort: 'Khóa 2024',
  enrolledCourses: 3,
  completionRate: 75,
  avgScore: 8.5
};

const mockCourseProgress = [
  {
    id: '1',
    name: 'Digital Marketing Pro',
    code: 'DM-001',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop',
    progress: 100,
    lastAccess: 'Hôm nay, 10:24',
    status: 'completed' as const
  },
  {
    id: '2',
    name: 'UI/UX Design Master',
    code: 'UI-024',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop',
    progress: 65,
    lastAccess: 'Hôm qua, 15:30',
    status: 'in_progress' as const
  },
  {
    id: '3',
    name: 'Kỹ năng Giao tiếp',
    code: 'BC-101',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop',
    progress: 25,
    lastAccess: '12 thg 05, 2024',
    status: 'in_progress' as const
  }
];

const mockActivities = [
  {
    id: '1',
    type: 'quiz',
    title: 'Đã đạt 9/10 điểm bài kiểm tra cuối khóa',
    course: 'Digital Marketing Pro',
    time: '10:45 • Hôm nay',
    isPrimary: true
  },
  {
    id: '2',
    type: 'lesson',
    title: 'Đã hoàn thành bài 5: Phân tích khách hàng',
    course: 'UI/UX Design Master',
    time: 'Hôm qua',
    isPrimary: false
  },
  {
    id: '3',
    type: 'start',
    title: 'Đã bắt đầu học: Kỹ năng Giao tiếp',
    course: 'Phần: Mở đầu khóa học',
    time: '12 thg 05, 2024',
    isPrimary: false
  },
  {
    id: '4',
    type: 'enroll',
    title: 'Đăng ký thành công 3 khóa học mới',
    course: 'Cổng thông tin tự động',
    time: '01 thg 05, 2024',
    isPrimary: false
  }
];

const StudentDetailPage = () => {
  const { id: _id } = useParams();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'check';
      case 'lesson':
        return 'auto_stories';
      case 'start':
        return 'play_circle';
      case 'enroll':
        return 'emoji_events';
      default:
        return 'info';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Hoàn thành', className: 'bg-green-100 text-green-600' };
      case 'in_progress':
        return { label: 'Đang học', className: 'bg-amber-100 text-amber-600' };
      default:
        return { label: 'Chưa bắt đầu', className: 'bg-slate-100 text-slate-500' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 -mx-8 -mt-8 px-8 py-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/teacher/students" className="text-slate-500 text-sm font-medium hover:text-[#0074bd] transition-colors">
            Quản lý học viên
          </Link>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-slate-500 text-sm font-medium">Chi tiết học viên</span>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-[#101518] text-sm font-bold">{mockStudent.name}</span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div
              className="size-24 rounded-full bg-cover bg-center border-4 border-slate-50 shrink-0"
              style={{ backgroundImage: `url('${mockStudent.avatar}')` }}
            />
            <div className="flex flex-col">
              <h2 className="text-[#101518] text-2xl font-bold leading-tight">{mockStudent.name}</h2>
              <p className="text-slate-500 text-base">{mockStudent.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                  Đang hoạt động
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  {mockStudent.cohort}
                </span>
              </div>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#0074bd] text-white text-sm font-bold hover:bg-[#0074bd]/90 transition-all shadow-lg shadow-[#0074bd]/25">
            <span className="material-symbols-outlined text-lg">mail</span>
            <span>Gửi tin nhắn</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#0074bd]/10 p-2 rounded-lg text-[#0074bd]">
              <span className="material-symbols-outlined">library_books</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Khóa học đã đăng ký</p>
          </div>
          <p className="text-[#101518] text-3xl font-bold mt-2">{mockStudent.enrolledCourses}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#0074bd]/10 p-2 rounded-lg text-[#0074bd]">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Tỷ lệ hoàn thành TB</p>
          </div>
          <p className="text-[#101518] text-3xl font-bold mt-2">{mockStudent.completionRate}%</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#0074bd]/10 p-2 rounded-lg text-[#0074bd]">
              <span className="material-symbols-outlined">grade</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Điểm kiểm tra TB</p>
          </div>
          <p className="text-[#101518] text-3xl font-bold mt-2">{mockStudent.avgScore}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-[#101518] text-lg font-bold">Tiến độ khóa học</h2>
              <button className="text-[#0074bd] text-sm font-semibold hover:underline">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Khóa học</th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Tiến độ</th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Truy cập cuối</th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockCourseProgress.map((course) => {
                    const status = getStatusBadge(course.status);
                    return (
                      <tr key={course.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-10 w-14 bg-slate-100 rounded bg-cover bg-center shrink-0 border border-slate-200"
                              style={{ backgroundImage: `url('${course.thumbnail}')` }}
                            />
                            <div className="min-w-0">
                              <p className="text-[#101518] text-sm font-bold truncate">{course.name}</p>
                              <p className="text-slate-400 text-xs truncate">Mã: {course.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 w-32">
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#0074bd] rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <p className="text-[11px] font-bold text-slate-500">{course.progress}%</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600 text-sm">{course.lastAccess}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
            <h2 className="text-[#101518] text-lg font-bold mb-6">Hoạt động gần đây</h2>
            <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 pb-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="relative">
                  <div className={`absolute -left-[33px] top-0 p-2 h-7 w-7 rounded-full flex items-center justify-center ${
                    activity.isPrimary
                      ? 'bg-[#0074bd] text-white shadow-md shadow-[#0074bd]/20'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    <span className="material-symbols-outlined text-sm leading-none block">
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <p className="text-[#101518] text-sm font-bold leading-tight">{activity.title}</p>
                    <p className="text-slate-500 text-xs">{activity.course}</p>
                    <p className="text-slate-400 text-[10px] font-medium uppercase mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
