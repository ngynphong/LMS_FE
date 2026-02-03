import { Link } from "react-router-dom";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  fadeInUp,
} from "../ui/ScrollReveal";
import { useCourses } from "../../hooks/useCourses";

const FeaturedCoursesSection = () => {
  const { data, loading } = useCourses({
    pageNo: 0,
    pageSize: 4,
    sorts: ["createdAt:desc"],
    visibility: "PUBLIC",
    status: "PUBLISHED",
  });

  const courses = data?.data?.items?.slice(0, 4) || [];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1280px] mx-auto px-10">
        <ScrollReveal
          variant={fadeInUp}
          className="flex items-end justify-between mb-10"
        >
          <div className="flex flex-col gap-2">
            <span className="color-primary font-bold tracking-widest text-sm uppercase">
              Bộ sưu tập
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Khóa học nổi bật
            </h2>
          </div>
          <Link
            className="flex items-center gap-1 color-primary font-bold hover:gap-2 transition-all"
            to="/courses"
          >
            Xem tất cả
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
                  <Link to={`/courses/${course.id}`} className="block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={
                            course.thumbnailUrl ||
                            "https://placehold.co/600x400?text=No+Image"
                          }
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/600x400?text=No+Image";
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold color-primary">
                          {course.visibility === "PUBLIC"
                            ? "Công khai"
                            : "Riêng tư"}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col gap-2 h-[calc(100%-12rem)]">
                        <h3 className="font-bold text-gray-900 line-clamp-2 min-h-12 group-hover:color-primary transition-colors">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span className="material-symbols-outlined text-sm">
                            person
                          </span>{" "}
                          {course.teacherName || "IES EDUcation"}
                        </div>
                      </div>
                    </div>
                  </Link>
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
    </section>
  );
};

export default FeaturedCoursesSection;
