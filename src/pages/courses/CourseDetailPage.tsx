import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaPlay,
  FaStar,
  FaCheck,
  FaPlayCircle,
  FaChevronDown,
} from "react-icons/fa";
import {
  MdDescription,
  MdSchedule,
  MdWorkspacePremium,
  MdAllInclusive,
  MdDevices,
} from "react-icons/md";
import { useCourseDetail, useStudentCourses } from "../../hooks/useCourses";
import { getLessonById } from "../../services/lessonService";
import type { ApiLesson, LessonItem } from "../../types/learningTypes";

const relatedCourses = [
  {
    id: "2",
    title: "Thiết kế UI/UX chuyên sâu",
    instructor: "Trần Thị B",
    rating: 4.9,
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfXB0sRJT01IWsbEqwnAa8LY2olvOqz0KWQrK8A5jEC0tiuCdeuT6EQyKgB0WrU3qgMYNvh-PkBqPzR6QFbjBW95gn-QqOvyMMCheKyVq6b3lnDHhckfw3wW1y4uDZ_FcRBPKE_30HTzJQsqyDqTQVx5pav3KQCmqWYAikCEUqGzcBtS3Qy_vkoYBRKEWoWT93h9WiHC25OehvWHnWZRvNsEyRS0PqqbTDsxDjxaJRVIro1eBVoMBcuI-7bMHbFmQXhJagHcjA4U9B",
  },
  {
    id: "3",
    title: "Data Science cơ bản",
    instructor: "Lê Văn C",
    rating: 4.7,
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUM01xgb-NDQxsaEe0JFrpbOH89-eMBvb1to2vtQ_zbRzk5COFNi3aKv9BNQJ7cAy2gOBGKrO0tp-2g3oxYo3WyVcSxbAnu2RHEQPIUgmBfMziv4qD43rNuZNu_nirhugILjQCcbDAy1E5HFTj0xvhmL3_bJkt_BOYKn8jy01693yXOxQICvLsJHJ5TrLjPx96lHCKR7miZrI195cCw9Hxnk2Rqw0FNZ8uvC7azGiaBhntc9UrZVwAO24noD_jr7QA47YtF6XNRhCj",
  },
  {
    id: "4",
    title: "Mobile App Development",
    instructor: "Phạm Minh D",
    rating: 4.6,
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXTI27iXOPvdI1ImreB2it5S8pGjlI6D3sefLhZTLMZUu2s5I4GcNQNco54jsFNx2DMTA9u806pjXZqlSwPjkhhiwoL4dNBqK_S_tWG_ptJAp2ZquDLXHaXFoQvTxNCACnEVz803gxvJ2vbxAeV4eSreFv-GRvriItejT2V5ysRvRxsl-NJ9k7XDbQMU2aA8076tCM42hc7rR5T8Ma8q0LVPY9TaGtTkmP-BiS8OBynsN8kH9A226f79oCeeulXV2D0VzGcmgfWdAt",
  },
];

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, loading, error } = useCourseDetail(id);
  const navigate = useNavigate();

  // Enrollment Check
  const { data: enrolledCourses, loading: loadingEnrolled } = useStudentCourses(
    { pageSize: 1000 },
  ); // Fetch all to check
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (enrolledCourses && id) {
      const enrolled = enrolledCourses.some((c) => c.id === id);
      setIsEnrolled(enrolled);
    }
  }, [enrolledCourses, id]);

  const [activeTab, setActiveTab] = useState<"intro" | "content" | "reviews">(
    "intro",
  );
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [lessonItemsMap, setLessonItemsMap] = useState<
    Record<string, LessonItem[]>
  >({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const toggleSection = async (index: number) => {
    // If not enrolled, prevent expanding content? or simple show locked?
    // User requested "nhập code thì mới có thể xem chi tiết".
    // So if not enrolled, maybe we shouldn't even show the content tab active,
    // or show it but locked. For now, let's keep it visible but maybe control access in backend or similar.
    // The requirement is mostly about the "Start Learning" button triggering the Enroll flow.

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
        <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
          progress_activity
        </span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <span className="material-symbols-outlined text-4xl text-red-500">
          error
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
  const rating = 5.0; // Placeholder
  const reviewCount = 0; // Placeholder
  const studentCount = 0; // Placeholder
  const schoolName = course.school?.name || "LMS Platform";

  const includes = [
    {
      icon: <MdDescription />,
      text: `${course?.lessons?.length || 0} chương học`,
    },
    { icon: <MdSchedule />, text: "Truy cập mọi lúc" },
    { icon: <MdWorkspacePremium />, text: "Chứng chỉ hoàn tất" },
    { icon: <MdAllInclusive />, text: "Truy cập trọn đời" },
    { icon: <MdDevices />, text: "Học trên mọi thiết bị" },
  ];

  const learningPoints = [
    "Nắm vững kiến thức nền tảng và nâng cao",
    "Làm chủ các công cụ và kỹ thuật mới nhất",
    "Xây dựng dự án thực tế",
    "Phát triển tư duy giải quyết vấn đề",
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <nav className="flex text-sm text-gray-600">
            <Link to="/" className="hover:color-primary">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link to="/courses" className="hover:color-primary">
              {schoolName}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">{course.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="flex flex-col gap-6">
            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl">
              <img
                src={course.thumbnailUrl || ""}
                alt={course.name}
                className="w-full h-full object-cover opacity-60"
              />
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
                <button
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "reviews"
                      ? "color-primary border-[#0077BE]"
                      : "text-gray-600 border-transparent hover:color-primary"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Đánh giá
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "intro" && (
                  <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {course.name}
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar className="text-lg" />
                        <span className="font-bold text-gray-900">
                          {rating}
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">
                        ({reviewCount} đánh giá)
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">
                        {studentCount} học viên
                      </span>
                    </div>

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
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
                          lock
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
                                          <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">
                                            progress_activity
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

                {activeTab === "reviews" && (
                  <div className="text-center py-12 text-gray-500">
                    <p>Chưa có đánh giá nào</p>
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
                style={{
                  backgroundImage: `url('${course.thumbnailUrl || ""}')`,
                }}
              />
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
                      onClick={() => navigate(`/student/courses/${course.id}/learn`)}
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
            {relatedCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`} // Mock link since these are fake related courses
                className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg group"
              >
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url('${course.thumbnail}')` }}
                />
                <div className="p-4 flex flex-col gap-2">
                  <h4 className="font-bold group-hover:color-primary transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-xs text-gray-600">{course.instructor}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-yellow-500">
                      <FaStar className="text-sm" />
                      {course.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;
