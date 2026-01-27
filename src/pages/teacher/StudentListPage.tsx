import { Link } from 'react-router-dom';
import { mockStudents } from '../../data/student';
import type { Student } from '../../types/student';


const StudentListPage = () => {
  const activeCount = mockStudents.filter((s) => s.status === 'active').length;
  const avgCompletion = Math.round(
    mockStudents.reduce((sum, s) => sum + s.completionRate, 0) / mockStudents.length
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(-2)
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: Student['status']) => {
    if (status === 'active') {
      return { label: 'Đang hoạt động', className: 'bg-green-100 text-green-600' };
    }
    return { label: 'Không hoạt động', className: 'bg-slate-100 text-slate-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#101518] text-2xl font-bold tracking-tight">Quản lý học viên</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi tiến độ và hoạt động của học viên</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0074bd] text-white text-sm font-bold shadow-sm hover:bg-[#0074bd]/90 transition-all">
          <span className="material-symbols-outlined text-lg">download</span>
          Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
          />
        </div>
        <select className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]">
          <option value="all">Tất cả khóa học</option>
          <option value="dm">Digital Marketing Pro</option>
          <option value="uiux">UI/UX Design Master</option>
          <option value="comm">Kỹ năng Giao tiếp</option>
        </select>
        <select className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]">
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <select className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]">
          <option value="recent">Truy cập gần nhất</option>
          <option value="name">Theo tên A-Z</option>
          <option value="progress">Tiến độ cao nhất</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-[#0074bd]">group</span>
            <span className="text-xs font-medium">Tổng học viên</span>
          </div>
          <p className="text-[#101518] text-2xl font-bold mt-1">{mockStudents.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-xs font-medium">Đang hoạt động</span>
          </div>
          <p className="text-green-600 text-2xl font-bold mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-amber-500">schedule</span>
            <span className="text-xs font-medium">Không hoạt động</span>
          </div>
          <p className="text-amber-600 text-2xl font-bold mt-1">{mockStudents.length - activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-[#0074bd]">trending_up</span>
            <span className="text-xs font-medium">Hoàn thành TB</span>
          </div>
          <p className="text-[#0074bd] text-2xl font-bold mt-1">{avgCompletion}%</p>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Học viên</th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Tiến độ</th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Truy cập cuối</th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStudents.map((student) => {
                const status = getStatusBadge(student.status);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.urlImg ? (
                          <div
                            className="size-10 rounded-full bg-cover bg-center shrink-0 border border-slate-200"
                            style={{ backgroundImage: `url('${student.urlImg}')` }}
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-[#0074bd]/10 flex items-center justify-center text-[#0074bd] font-bold text-xs shrink-0">
                            {getInitials(student.name)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[#101518] text-sm font-bold truncate">{student.name}</p>
                          <p className="text-slate-400 text-xs truncate">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-slate-700 text-sm font-medium">{student.courseName}</p>
                        <p className="text-slate-400 text-xs">{student.enrolledCourses} khóa học</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 w-28">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0074bd] rounded-full"
                            style={{ width: `${student.completionRate}%` }}
                          />
                        </div>
                        <p className="text-[11px] font-bold text-slate-500">{student.completionRate}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{student.lastAccess}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/teacher/students/${student.id}`}
                        className="inline-flex items-center gap-1 text-[#0074bd] text-sm font-semibold hover:underline"
                      >
                        Chi tiết
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-slate-500 text-sm">
            Hiển thị <span className="font-semibold">1-{mockStudents.length}</span> trong tổng số <span className="font-semibold">{mockStudents.length}</span> học viên
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-1.5 rounded bg-[#0074bd] text-white text-sm font-medium">1</button>
            <button className="px-3 py-1.5 rounded border border-slate-200 text-slate-500 text-sm hover:bg-slate-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListPage;
