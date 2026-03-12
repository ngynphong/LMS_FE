import { FaBook, FaKey } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

// Props for student variant (can be spread from CourseData)
interface StudentCourseProps {
  id: string | number;
  title: string;
  category: string;
  thumbnailUrl: string;
  instructor?: string;
  createdAt?: string;
  onClick?: () => void;
  isEnrolled?: boolean;
  visibility?: string;
}

// Props for teacher variant (uses course object)
interface TeacherCourseProps {
  course: any;
  variant: "teacher";
  onInvite?: () => void;
  onDelete?: () => void;
}

// Union type for CourseCardProps
type CourseCardProps =
  | (StudentCourseProps & { variant?: "student"; course?: never })
  | TeacherCourseProps;

const CourseCard = (props: CourseCardProps) => {

  if (props.variant === "teacher" && props.course) {
    const { course } = props;

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="aspect-video relative">
          <div
            className="w-full h-full bg-center bg-cover bg-slate-100"
            style={{
              backgroundImage: `url("${course.thumbnailUrl || course.thumbnail}")`,
            }}
          >
            {!(course.thumbnailUrl || course.thumbnail) && (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/img/default-course.jpg"
                  alt={course.name || course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${course.status === "PUBLISHED" ? "bg-green-100 text-green-700" : course.status === "DRAFT" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
            >
              {course.status === "PUBLISHED"
                ? "Công khai"
                : course.status === "DRAFT"
                  ? "Bản nháp"
                  : "Bị khóa"}
            </span>
          </div>
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${course.visibility === "PUBLIC" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
            >
              {course.visibility === "PUBLIC" ? "Công khai" : "Riêng tư"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
            {course.name || course.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">
            {course.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <span className="text-sm">
                <FaBook />
              </span>
              {course.lessonCount || 0} bài học
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/teacher/courses/${course.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 hover:translate-y-[-2px] duration-300 transition-all"
            >
              <span className="text-sm">
                <MdEdit />
              </span>
              Sửa
            </Link>
            <button
              onClick={() => props.onInvite?.()}
              className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 hover:translate-y-[-2px] duration-300 transition-all cursor-pointer"
              title="Tạo mã mời"
            >
              <span className="text-sm">
                <FaKey />
              </span>
            </button>
            <Link
              to={`/teacher/courses/${course.id}`}
              className="flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 hover:translate-y-[-2px] duration-300 transition-all"
              title="Xem khóa học"
            >
              <span className="text-sm">
                <IoEyeSharp />
              </span>
            </Link>
            <button
              onClick={() => props.onDelete?.()}
              className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 hover:translate-y-[-2px] duration-300 transition-all cursor-pointer"
              title="Xóa khóa học"
            >
              <span className="text-sm">
                <MdDelete />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student variant (default) - uses spread props
  const {
    id,
    title,
    category,
    thumbnailUrl,
    createdAt,
    instructor,
    onClick,
    isEnrolled,
    visibility,
  } = props as StudentCourseProps;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
      <div
        className="relative h-44 w-full overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <div
          className="w-full h-full bg-center bg-cover bg-slate-100"
          style={{ backgroundImage: `url("${thumbnailUrl}")` }}
        >
          {!thumbnailUrl && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/img/default-course.jpg"
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="absolute top-3 left-3 color-primary-bg text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
          {category}
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${visibility === "PUBLIC" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
          >
            {visibility === "PUBLIC" ? "Công khai" : "Riêng tư"}
          </span>
        </div>
        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-md">
            Đã tham gia
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3
          className="text-gray-900 font-bold text-base leading-snug line-clamp-2 h-12 cursor-pointer"
          onClick={onClick}
        >
          {title}
        </h3>
        <p className="text-gray-500 text-sm">
          Ngày tạo: {createdAt && new Date(createdAt).toLocaleDateString()}
        </p>
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
          {instructor && (
            <span className="text-gray-600 text-sm">GV: {instructor}</span>
          )}
          {onClick ? (
            <button
              className="color-primary cursor-pointer text-sm font-bold hover:underline ml-auto"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Tham gia
            </button>
          ) : (
            <Link
              className="color-primary text-sm font-bold hover:underline ml-auto"
              to={`/courses/${id}`}
            >
              Xem chi tiết
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
