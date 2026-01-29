import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import type { Course } from "../../types/course";

// type CourseCardVariant = 'student' | 'teacher';

// Props for student variant (can be spread from CourseData)
interface StudentCourseProps {
  id: string | number;
  title: string;
  category: string;
  image: string;
  duration?: string;
  rating: number;
  reviews?: number;
  instructor?: string;
}

// Props for teacher variant (uses course object)
interface TeacherCourseProps {
  course: Course;
  variant: "teacher";
}

// Union type for CourseCardProps
type CourseCardProps =
  | (StudentCourseProps & { variant?: "student"; course?: never })
  | TeacherCourseProps;

const CourseCard = (props: CourseCardProps) => {
  // Teacher variant status config
  const statusConfig = {
    published: {
      label: "Đã xuất bản",
      className: "bg-green-100 text-green-700",
    },
    draft: {
      label: "Bản nháp",
      className: "bg-amber-100 text-amber-700",
    },
  };

  if (props.variant === "teacher" && props.course) {
    const { course } = props;
    const status = statusConfig[course.status];

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div
          className="h-40 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('${course.thumbnail || course.image}')`,
          }}
        />

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="text-[#101518] text-base font-bold leading-tight line-clamp-2">
              {course.title}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[#5e7b8d] mb-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">group</span>
              <span>{course.studentCount} học viên</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">
                play_circle
              </span>
              <span>{course.lessonCount} bài học</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center text-sm mb-4">
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-amber-500 text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="font-semibold text-[#101518]">
                {course.rating}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              to={`/teacher/courses/${course.id}/edit`}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#0074bd]/10 text-[#0074bd] text-sm font-bold hover:bg-[#0074bd]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Chỉnh sửa
            </Link>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors">
              <span className="material-symbols-outlined text-base">
                delete
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student variant (default) - uses spread props
  const { id, title, category, image, duration, rating, reviews, instructor } =
    props as StudentCourseProps;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={image}
          alt={title}
        />
        <div className="absolute top-3 left-3 color-primary-bg text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
          {category}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2 h-12">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <span className="material-symbols-outlined text-sm">schedule</span>{" "}
          {duration}
          <span className="ml-2">
            <FaStar className="text-yellow-500 inline" />
          </span>{" "}
          {rating} ({reviews})
        </div>
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
          {instructor && (
            <span className="text-gray-600 text-sm">GV: {instructor}</span>
          )}
          <Link
            className="color-primary text-sm font-bold hover:underline ml-auto"
            to={`/courses/${id}`}
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
