import { Link } from "react-router-dom";
import type { Student } from "../../../types/student";

interface StudentCardProps {
  student: Student;
}

const StudentCard = ({ student }: StudentCardProps) => {
  const statusConfig = {
    active: {
      label: "Đang hoạt động",
      className: "bg-green-100 text-green-600",
    },
    inactive: {
      label: "Không hoạt động",
      className: "bg-slate-100 text-slate-500",
    },
  };

  const status = statusConfig[student.status || "inactive"];

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {student.urlImg ? (
          <div
            className="size-12 rounded-full bg-cover bg-center shrink-0 border-2 border-slate-100"
            style={{ backgroundImage: `url('${student.urlImg}')` }}
          />
        ) : (
          <div className="size-12 rounded-full bg-[#0074bd]/10 flex items-center justify-center text-[#0074bd] font-bold text-sm shrink-0">
            {getInitials(`${student.lastName} ${student.firstName}`)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[#101518] text-base font-bold truncate">
                {student.lastName} {student.firstName}
              </h3>
              <p className="text-slate-500 text-sm truncate">{student.email}</p>
            </div>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-base">
                library_books
              </span>
              <span>{student.enrolledCourses} khóa học</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-base">
                task_alt
              </span>
              <span>{student.completionRate}% hoàn thành</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0074bd] rounded-full transition-all"
                style={{ width: `${student.completionRate}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-slate-400 text-xs">
              Truy cập: {student.lastAccess}
            </p>
            <Link
              to={`/teacher/students/${student.id}`}
              className="flex items-center gap-1 text-[#0074bd] text-sm font-semibold hover:underline"
            >
              Chi tiết
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
