import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaPlay,
  FaCheck,
  FaPlayCircle,
  FaChevronDown,
  FaCircleNotch,
  FaLock,
} from "react-icons/fa";
import {
  MdDescription,
  MdSchedule,
  MdWorkspacePremium,
  MdAllInclusive,
  MdDevices,
  MdError,
} from "react-icons/md";
import {
  useCourseDetail,
  useStudentCourses,
  useCourses,
} from "@/hooks/useCourses";
import { getLessonById } from "@/services/lessonService";
import type { ApiLesson, LessonItem } from "@/types/learningTypes";
import Breadcrumb from "@/components/common/Breadcrumb";
import CourseCard from "@/components/courses/CourseCard";
import EnrollmentModal from "@/components/courses/EnrollmentModal";

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading: loading, error } = useCourseDetail(id);
  const navigate = useNavigate();

  // Fetch related courses
  const { data: relatedCoursesResponse, isLoading: loadingRelated } =
    useCourses({ pageSize: 4, visibility: "PUBLIC" }, { enabled: !!course });

  const relatedCourses =
    relatedCoursesResponse?.data?.items
      ?.filter((c) => c.id !== id)
      .slice(0, 3) || [];

  // Enrollment Check
  const { data: enrolledCoursesData, isLoading: loadingEnrolled } =
    useStudentCourses({ pageSize: 1000 }); // Fetch all to check
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Enrollment modal state for related courses
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedRelatedCourseId, setSelectedRelatedCourseId] = useState<
    string | null
  >(null);
  const [selectedRelatedVisibility, setSelectedRelatedVisibility] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (enrolledCoursesData?.items && id) {
      const enrolled = enrolledCoursesData.items.some((c) => c.id === id);
      setIsEnrolled(enrolled);
    }
  }, [enrolledCoursesData, id]);

  const handleRelatedCourseClick = (courseId: string, visibility?: string) => {
    setSelectedRelatedCourseId(courseId);
    setSelectedRelatedVisibility(visibility || null);
    setShowEnrollModal(true);
  };

  const [activeTab, setActiveTab] = useState<"intro" | "content" | "reviews">(
    "intro",
  );
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [lessonItemsMap, setLessonItemsMap] = useState<
    Record<string, LessonItem[]>
  >({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const toggleSection = async (index: number) => {
    const isOpen = openSections.includes(index);
    if (isOpen) {
      setOpenSections((prev) => prev.filter((i) => i !== index));
    } else {
      setOpenSections((prev) => [...prev, index]);
      // Fetch items if not already present
      const lesson = course?.lessons?.[index];
      if (lesson && !lessonItemsMap[lesson.id]) {
        setLoadingItems((prev) => ({ ...prev, [lesson.id]: true }));
        try {
          // Use getLessonById to fetch full lesson details including items
          const lessonDetail = await getLessonById(lesson.id);
          if (lessonDetail && lessonDetail.lessonItems) {
            setLessonItemsMap((prev) => ({
              ...prev,
              [lesson.id]: lessonDetail.lessonItems || [],
            }));
          }
        } catch (err) {
          console.error("Failed to fetch items for lesson", lesson.id, err);
        } finally {
          setLoadingItems((prev) => ({ ...prev, [lesson.id]: false }));
        }
      }
    }
  };

  if (loading || loadingEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin text-4xl text-blue-600">
          <FaCircleNotch />
        </span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <span className="text-4xl text-red-500">
          <MdError />
        </span>
        <p className="text-gray-600">
          {error?.message || "Không tìm thấy khóa học"}
        </p>
        <Link to="/courses" className="text-blue-600 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Derived data
  const teacherName =
    course.teacherName ||
    (course.teacher
      ? `${course.teacher.firstName} ${course.teacher.lastName}`
      : "Giảng viên");
  const schoolName = course.school?.name || "LMS Platform";

  const includes = [
    {
      icon: <MdDescription />,
      text: `${course?.lessons?.length || 0} chương học`,
    },
    { icon: <MdSchedule />, text: "Truy cập mọi lúc" },
    { icon: <MdWorkspacePremium />, text: "Khoá học chất lượng" },
    { icon: <MdAllInclusive />, text: "Học mọi lúc mọi nơi" },
    { icon: <MdDevices />, text: "Học trên mọi thiết bị" },
  ];

  const learningPoints = [
    "Nắm vững kiến thức nền tảng",
    "Làm chủ các công cụ và kỹ thuật mới nhất",
    "Học tập linh hoạt mọi lúc mọi nơi",
    "Phát triển tư duy giải quyết vấn đề",
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <Breadcrumb
            items={[
              { label: "Trang chủ", url: "/" },
              { label: schoolName, url: "/courses" },
              { label: course.name },
            ]}
            className="flex text-sm text-gray-600"
            itemClassName="hover:color-primary"
            activeItemClassName="font-medium text-gray-900"
            separator={<span className="mx-2">/</span>}
          />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="flex flex-col gap-6">
            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
              <div
                className="w-full h-full bg-center bg-cover bg-slate-100"
                style={{ backgroundImage: `url("${course.thumbnailUrl}")` }}
              >
                {!course.thumbnailUrl && (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src="/img/default-course.jpg"
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center group cursor-pointer hover:bg-black/20 transition-colors">
                <div className="color-primary text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <FaPlay className="text-2xl ml-1" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                {/* ... Tabs Headers ... reusing existing styles */}
                <button
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "intro"
                      ? "color-primary border-[#0077BE]"
                      : "text-gray-600 border-transparent hover:color-primary"
                  }`}
                  onClick={() => setActiveTab("intro")}
                >
                  Giới thiệu
                </button>
                <button
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "content"
                      ? "color-primary border-[#0077BE]"
                      : "text-gray-600 border-transparent hover:color-primary"
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Nội dung khóa học
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "intro" && (
                  <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {course.name}
                    </h1>

                    <p className="text-gray-700 leading-relaxed">
                      {course.description || "Chưa có mô tả chi tiết."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {learningPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <FaCheck className="text-green-500 text-sm mt-1 shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold">Nội dung khóa học</h3>
                    {!isEnrolled ? (
                      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                        <span className="text-4xl text-gray-400 mb-2">
                          <FaLock />
                        </span>
                        <p className="text-gray-500 mb-4">
                          Bạn cần tham gia khóa học để xem nội dung chi tiết
                        </p>
                        <Link
                          to="/courses"
                          className="px-6 py-2 bg-[#0074bd] text-white rounded-lg font-bold hover:bg-[#0063a1]"
                        >
                          Quay lại danh sách để đăng ký
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {course.lessons && course.lessons.length > 0 ? (
                          course.lessons.map(
                            (lesson: ApiLesson, index: number) => {
                              const items =
                                lessonItemsMap[lesson.id] ||
                                lesson.lessonItems ||
                                [];
                              const isLoading = loadingItems[lesson.id];

                              return (
                                <div
                                  key={lesson.id}
                                  className="border border-gray-200 rounded-xl overflow-hidden"
                                >
                                  <button
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleSection(index)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold color-primary">
                                        Phần {index + 1}:
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <FaChevronDown
                                      className={`text-gray-600 transition-transform ${
                                        openSections.includes(index)
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                  {openSections.includes(index) && (
                                    <div className="p-5 border-t border-gray-200 flex flex-col gap-4">
                                      {isLoading ? (
                                        <div className="flex justify-center p-2">
                                          <span className="animate-spin text-2xl text-blue-600">
                                            <FaCircleNotch />
                                          </span>
                                        </div>
                                      ) : items && items.length > 0 ? (
                                        items.map(
                                          (
                                            item: LessonItem,
                                            itemIndex: number,
                                          ) => (
                                            <div
                                              key={item.id}
                                              className="flex items-center justify-between text-sm"
                                            >
                                              <div className="flex items-center gap-3">
                                                <FaPlayCircle className="text-gray-400" />
                                                <span className="text-gray-700">
                                                  {itemIndex + 1}. {item.title}
                                                </span>
                                              </div>
                                              <span className="text-gray-600">
                                                {item.type}
                                              </span>
                                            </div>
                                          ),
                                        )
                                      ) : (
                                        <p className="text-sm text-gray-500 italic">
                                          Chưa có nội dung cho phần này.
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )
                        ) : (
                          <p className="text-gray-500">Chưa có nội dung.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${course.thumbnailUrl}")` }}
              >
                {!course.thumbnailUrl && (
                  <div className="aspect-video w-full bg-cover bg-center">
                    <img
                      src="/img/default-course.jpg"
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Giảng viên</p>
                  <p className="text-lg font-bold text-gray-900">
                    {teacherName}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {isEnrolled ? (
                    <button
                      onClick={() =>
                        navigate(`/student/courses/${course.id}/learn`)
                      }
                      className="w-full h-12 color-primary-bg text-white font-bold rounded-lg hover:cursor-pointer hover:translate-y-[-2px] duration-300 transition-all shadow-md"
                    >
                      Tiếp tục học
                    </button>
                  ) : (
                    <div className="w-full text-center text-sm text-gray-500">
                      <p>Bạn chưa tham gia khóa học này.</p>
                      <Link
                        to="/courses"
                        className="text-blue-600 hover:underline"
                      >
                        Quay lại danh sách
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <p className="font-bold text-sm">Khóa học này bao gồm:</p>
                  <ul className="flex flex-col gap-3">
                    {includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <span className="text-lg text-gray-600">
                          {item.icon}
                        </span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <section className="mt-16 py-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Khóa học liên quan</h2>
            <Link
              to="/courses"
              className="color-primary text-sm font-bold hover:underline"
            >
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingRelated ? (
              <div className="col-span-1 md:col-span-3 flex justify-center py-8">
                <span className="animate-spin text-2xl text-blue-600">
                  <FaCircleNotch />
                </span>
              </div>
            ) : relatedCourses.length > 0 ? (
              relatedCourses.map((relatedCourse) => (
                <CourseCard
                  key={relatedCourse.id}
                  id={relatedCourse.id}
                  title={relatedCourse.name}
                  visibility={relatedCourse.visibility}
                  category={relatedCourse.schoolName || "Khóa học"}
                  thumbnailUrl={relatedCourse.thumbnailUrl || ""}
                  instructor={relatedCourse.teacherName || "Giảng viên"}
                  createdAt={relatedCourse.createdAt}
                  onClick={() =>
                    handleRelatedCourseClick(
                      relatedCourse.id,
                      relatedCourse.visibility,
                    )
                  }
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center text-gray-500 py-8">
                Không tìm thấy khóa học liên quan.
              </div>
            )}
          </div>
        </section>
      </div>
      {/* Enrollment Modal for Related Courses */}
      {showEnrollModal && selectedRelatedCourseId && (
        <EnrollmentModal
          courseId={selectedRelatedCourseId}
          courseVisibility={selectedRelatedVisibility}
          onClose={() => setShowEnrollModal(false)}
        />
      )}
    </div>
  );
};

export default CourseDetailPage;
