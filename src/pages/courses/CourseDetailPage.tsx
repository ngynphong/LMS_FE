import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaStar,
  FaCheck,
  FaChevronDown,
  FaPlayCircle,
} from "react-icons/fa";
import {
  MdDescription,
  MdSchedule,
  MdWorkspacePremium,
  MdAllInclusive,
  MdDevices,
} from "react-icons/md";

// Mock data - replace with API call
const courseData = {
  id: "1",
  title: "Lập trình Web Fullstack từ con số 0",
  description:
    "Khóa học này được thiết kế để đưa bạn từ một người mới bắt đầu hoàn toàn trở thành một nhà phát triển Fullstack thực thụ. Bạn sẽ học cách xây dựng các ứng dụng web hiện đại từ giao diện người dùng đến hệ thống phía máy chủ.",
  thumbnail:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBTnu7tEadFCucDTlaAYiK551HnOiunBrzBEvJvjSAiH44h1-8cIlJ0zQWt1js5roKSbrku9jF1Yu6uDmgceEeVAZLHSSdB2jY1UP1QghqTBHex_Jb0mNvP-ZMM4yivUdNWXLGrvRZu9aFV8zDdwNPUyu1deOWn4fPafTJIIjwePvbzS3GAJrwG8JppgRC-tTGiytn-NeR-z5aUuIb8v-PWmeBsK3-LlvB8-XDv__U9sVQKeLNblrSArbJLXjCVFasNsjbc0gcdOsFB",
  rating: 4.8,
  reviews: 1250,
  students: 15402,
  instructor: "TS. Nguyễn Văn A",
  category: "Lập trình",
  learningPoints: [
    "Nắm vững HTML5, CSS3, JavaScript (ES6+)",
    "Làm chủ ReactJS và các thư viện UI hiện đại",
    "Xây dựng Backend với Node.js và Express",
    "Quản lý cơ sở dữ liệu MongoDB và SQL",
  ],
  includes: [
    { icon: <MdDescription />, text: "30 bài giảng" },
    { icon: <MdSchedule />, text: "20 giờ video chất lượng cao" },
    { icon: <MdWorkspacePremium />, text: "Chứng chỉ hoàn tất khóa học" },
    { icon: <MdAllInclusive />, text: "Truy cập trọn đời" },
    { icon: <MdDevices />, text: "Học trên mọi thiết bị" },
  ],
  curriculum: [
    {
      title: "Tổng quan & Cơ bản về Web",
      lessons: [
        { title: "Cách Web hoạt động", duration: "12:45" },
        { title: "Cấu trúc một trang HTML5", duration: "15:20" },
        { title: "Selectors trong CSS", duration: "10:30" },
      ],
    },
    {
      title: "Lập trình JavaScript nâng cao",
      lessons: [
        { title: "Closures & Scopes", duration: "20:15" },
        { title: "Promises & Async/Await", duration: "18:30" },
        { title: "DOM Manipulation", duration: "16:45" },
      ],
    },
  ],
};

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
  const [activeTab, setActiveTab] = useState<"intro" | "content" | "reviews">(
    "intro",
  );
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

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
              {courseData.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">
              {courseData.title}
            </span>
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
                src={courseData.thumbnail}
                alt="Course Preview"
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
                      {courseData.title}
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar className="text-lg" />
                        <span className="font-bold text-gray-900">
                          {courseData.rating}
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">
                        ({courseData.reviews.toLocaleString("vi-VN")} đánh giá)
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">
                        {courseData.students.toLocaleString("vi-VN")} học viên
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {courseData.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {courseData.learningPoints.map((point, index) => (
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
                    <div className="flex flex-col gap-2">
                      {courseData.curriculum.map((section, index) => (
                        <div
                          key={index}
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
                                {section.title}
                              </span>
                            </div>
                            <FaChevronDown
                              className={`text-gray-600 transition-transform ${
                                openSections.includes(index) ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {openSections.includes(index) && (
                            <div className="p-5 border-t border-gray-200 flex flex-col gap-4">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <FaPlayCircle className="text-gray-400" />
                                    <span className="text-gray-700">
                                      {lessonIndex + 1}. {lesson.title}
                                    </span>
                                  </div>
                                  <span className="text-gray-600">
                                    {lesson.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                style={{ backgroundImage: `url('${courseData.thumbnail}')` }}
              />
              <div className="p-6 flex flex-col gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Giảng viên</p>
                  <p className="text-lg font-bold text-gray-900">
                    {courseData.instructor}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full h-12 color-primary-bg text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-md">
                    Bắt đầu học
                  </button>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <p className="font-bold text-sm">Khóa học này bao gồm:</p>
                  <ul className="flex flex-col gap-3">
                    {courseData.includes.map((item, index) => (
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
                to={`/courses/${course.id}`}
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
