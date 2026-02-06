import { Link } from "react-router-dom";

export interface StudentEnrolledCourse {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  status?: string;
  teacherName?: string | null;
  schoolName?: string | null;
  progressPercent?: number;
  completedAt?: string | null;
  enrolledAt?: string | null;
  updatedAt: string;
}

interface StudentCourseCardProps {
  course: StudentEnrolledCourse;
}

/**
 * Format date to Vietnamese locale
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Course card component for student's enrolled courses
 */
const StudentCourseCard = ({ course }: StudentCourseCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={course.thumbnailUrl || "/img/book.png"}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback khi ảnh lỗi
            e.currentTarget.src = "/img/book.png";
          }}
        />
        {/* Status Badge */}
        <span
          className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
            course.status === "PUBLISHED"
              ? "bg-green-500"
              : course.status === "DRAFT"
                ? "bg-yellow-500"
                : "bg-slate-500"
          }`}
        >
          {course.status === "PUBLISHED"
            ? "Đang mở"
            : course.status === "DRAFT"
              ? "Bản nháp"
              : course.status || "Khóa học"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="text-[#111518] text-base font-bold leading-tight mb-2 line-clamp-2">
          {course.name}
        </h3>

        {/* Teacher & School Info */}
        <div className="flex flex-col gap-1 mb-3 text-sm text-slate-500">
          {course.teacherName && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">
                person
              </span>
              <span>{course.teacherName}</span>
            </div>
          )}
          {course.schoolName && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">
                school
              </span>
              <span>{course.schoolName}</span>
            </div>
          )}
        </div>

        {/* Progress & Dates */}
        <div className="flex flex-col gap-2 mb-4 mt-auto">
          {course.progressPercent !== undefined && (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Tiến độ</span>
                <span className="font-medium color-primary">
                  {course.progressPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full color-primary-bg rounded-full transition-all duration-500"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              calendar_month
            </span>
            {course.completedAt ? (
              <span>Hoàn thành: {formatDate(course.completedAt)}</span>
            ) : course.enrolledAt ? (
              <span>Tham gia: {formatDate(course.enrolledAt)}</span>
            ) : (
              <span>Cập nhật: {formatDate(course.updatedAt)}</span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/student/courses/${course.id}/learn`}
          className="w-full py-2.5 md:py-3 color-primary-bg text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-90"
        >
          Vào học
          <span className="material-symbols-outlined text-sm">play_circle</span>
        </Link>
      </div>
    </div>
  );
};

/**
 * Skeleton loading card
 */
export const StudentCourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 h-[320px] animate-pulse">
      <div className="bg-slate-200 h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
};

export default StudentCourseCard;
