import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
} from "@/components/ui/ScrollReveal";
import { useTopEnrolledCourses, useStudentCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import CourseCard from "@/components/courses/CourseCard";
import EnrollmentModal from "@/components/courses/EnrollmentModal";

const FeaturedCoursesSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseVisibility, setSelectedCourseVisibility] = useState<
    string | null
  >(null);

  const { data, isLoading: loading } = useTopEnrolledCourses();

  // Student Enrollment Data
  const { data: enrolledCoursesData } = useStudentCourses(
    { pageSize: 1000 },
    { enabled: isAuthenticated },
  );

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (enrolledCoursesData?.items) {
      setEnrolledCourseIds(new Set(enrolledCoursesData.items.map((c) => c.id)));
    }
  }, [enrolledCoursesData]);

  const handleCourseClick = (courseId: string, visibility?: string) => {
    if (enrolledCourseIds.has(courseId)) {
      navigate(`/courses/${courseId}`);
    } else {
      setSelectedCourseId(courseId);
      setSelectedCourseVisibility(visibility || null);
      setShowEnrollModal(true);
    }
  };

  const courses = data?.data?.slice(0, 4) || [];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1280px] mx-auto px-10">
        <ScrollReveal
          variant={fadeInUp}
          className="flex items-end justify-between gap-2 mb-10"
        >
          <div className="flex flex-col gap-2">
            <span className="color-primary font-bold tracking-widest text-sm uppercase">
              Bộ sưu tập
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Khóa học nổi bật
            </h2>
          </div>
          <Link
            className="flex items-center gap-1 color-primary font-bold hover:gap-2 transition-all text-sm sm:text-base"
            to="/courses"
          >
            Xem thêm
          </Link>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl h-[350px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => (
                <StaggerItem key={course.id}>
                  <CourseCard
                    id={course.id}
                    title={course.name}
                    thumbnailUrl={course.thumbnailUrl}
                    category={course.schoolName || "Khóa học"}
                    createdAt={course.createdAt}
                    instructor={course.teacherName}
                    onClick={() =>
                      handleCourseClick(course.id, course.visibility)
                    }
                    isEnrolled={enrolledCourseIds.has(course.id)}
                    visibility={course.visibility}
                  />
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Chưa có khóa học nào được hiển thị.
              </div>
            )}
          </StaggerContainer>
        )}
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedCourseId && (
        <EnrollmentModal
          courseId={selectedCourseId}
          courseVisibility={selectedCourseVisibility}
          onClose={() => setShowEnrollModal(false)}
        />
      )}
    </section>
  );
};

export default FeaturedCoursesSection;
