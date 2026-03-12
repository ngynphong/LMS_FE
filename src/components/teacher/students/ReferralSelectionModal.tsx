import { useState, useEffect } from "react";
import {
  useOtherTeachersCourses,
  useMyCourses,
  useCourseTeachers,
} from "@/hooks/useCourses";
import {
  useReferStudents,
  useAddBatchStudents,
} from "@/hooks/useStudentReferral";
import {
  FaCircleNotch,
  FaSearch,
  FaTimes,
  FaInbox,
  FaFilter,
  FaBook,
  FaCheck,
} from "react-icons/fa";
import { toast } from "@/components/common/Toast";
import PaginationControl from "@/components/common/PaginationControl";
import { IoPerson } from "react-icons/io5";

interface ReferralSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudentIds: string[];
  mode?: "REFERRAL" | "DIRECT_ADD";
}

const ReferralSelectionModal = ({
  isOpen,
  onClose,
  selectedStudentIds,
  mode = "REFERRAL",
}: ReferralSelectionModalProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Filter states
  const [status, setStatus] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");

  const { data: teachersData } = useCourseTeachers();
  const teachers = teachersData?.data || [];

  // Referral hook
  const { data: publicCoursesData, isLoading: publicLoading } =
    useOtherTeachersCourses(
      {
        pageNo: page - 1, // 0-indexed
        pageSize,
        keyword: debouncedKeyword,
        visibility: visibility || undefined,
        teacherKeyword: teacherName || undefined,
      },
      { enabled: isOpen && mode === "REFERRAL" },
    );

  // Direct Add hook - Show only my courses
  const { data: myCoursesData, isLoading: myLoading } = useMyCourses({
    pageNo: page - 1, // Service uses 0-indexed for myCourses based on observation in AdminCourseListPage
    pageSize,
    keyword: debouncedKeyword,
    status: status || undefined,
    visibility: visibility || undefined,
  });

  const referMutation = useReferStudents();
  const directAddMutation = useAddBatchStudents();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  if (!isOpen) return null;

  const courses =
    mode === "REFERRAL"
      ? publicCoursesData?.data?.items || []
      : myCoursesData?.items || [];
  const totalPages =
    (mode === "REFERRAL"
      ? publicCoursesData?.data?.totalPage
      : myCoursesData?.totalPage) || 1;
  const isLoading = mode === "REFERRAL" ? publicLoading : myLoading;

  const handleAction = async () => {
    if (!selectedCourseId) return;

    try {
      if (mode === "REFERRAL") {
        await referMutation.mutateAsync({
          courseId: selectedCourseId,
          data: { studentIds: selectedStudentIds, message },
        });
        toast.success("Đã gửi yêu cầu giới thiệu học sinh!");
      } else {
        await directAddMutation.mutateAsync({
          courseId: selectedCourseId,
          data: { studentIds: selectedStudentIds },
        });
        toast.success("Đã thêm học sinh vào khóa học thành công!");
      }
      onClose();
      setMessage("");
      setSelectedCourseId(null);
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại");
    }
  };

  const isPending = referMutation.isPending || directAddMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              {mode === "REFERRAL"
                ? "Giới thiệu đến khóa học"
                : "Thêm vào khóa học của tôi"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {mode === "REFERRAL"
                ? `Chọn khóa học đích để gửi yêu cầu cho ${selectedStudentIds.length} học sinh`
                : `Chọn khóa học của bạn để thêm trực tiếp ${selectedStudentIds.length} học sinh`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mr-2">
              <FaFilter className="text-xs" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Bộ lọc
              </span>
            </div>

            {mode === "REFERRAL" && (
              <div className="min-w-[160px]">
                <select
                  value={teacherName}
                  onChange={(e) => {
                    setTeacherName(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all"
                >
                  <option value="">Tất cả giáo viên</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.fullName}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="min-w-[140px]">
              <select
                value={visibility}
                onChange={(e) => {
                  setVisibility(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all"
              >
                <option value="">Tất cả hiển thị</option>
                <option value="PUBLIC">Công khai</option>
                <option value="PRIVATE">Riêng tư</option>
              </select>
            </div>

            {(teacherName || status || visibility) && (
              <button
                onClick={() => {
                  setTeacherName("");
                  setStatus("");
                  setVisibility("");
                  setPage(1);
                }}
                className="text-xs font-bold text-[#1E90FF] hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {mode === "REFERRAL" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Lời nhắn
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung yêu cầu gửi đến giáo viên khóa học..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm h-14 focus:ring-2 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all resize-none"
              />
            </div>
          )}

          {/* Course Grid */}
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {isLoading ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <FaCircleNotch className="animate-spin text-2xl text-[#1E90FF]" />
                  <span className="text-sm font-medium">
                    Đang tìm kiếm khóa học...
                  </span>
                </div>
              ) : courses.length > 0 ? (
                courses.map((course: any) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col h-[250px] ${
                      selectedCourseId === course.id
                        ? "border-[#1E90FF] bg-blue-50/30 ring-4 ring-blue-50"
                        : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                      <img
                        src={course.thumbnailUrl || "/img/default-course.jpg"}
                        alt={course.name || course.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3 bg-white flex-1 flex flex-col min-h-[80px]">
                      <h4
                        className="font-bold text-sm text-slate-900 line-clamp-2 mb-2"
                        title={course.name || course.title}
                      >
                        {course.name || course.title || "Tên khóa học"}
                      </h4>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <span className="text-[14px]">
                            <IoPerson />
                          </span>
                          <span className="truncate max-w-[80px]">
                            {course.teacherName || "Giáo viên"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#1E90FF] font-bold">
                          <span className="text-[14px]">
                            <FaBook />
                          </span>
                          <span>{course.lessonCount || 0} bài học</span>
                        </div>
                      </div>
                    </div>
                    {selectedCourseId === course.id && (
                      <div className="absolute top-2 right-2 size-6 bg-[#1E90FF] text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <span className="text-xl">
                          <FaCheck />
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <FaInbox className="text-3xl" />
                  <span className="text-sm font-medium">
                    Không tìm thấy khóa học nào
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white border-t border-slate-100 px-2 py-3">
              <PaginationControl
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                disablePageSizeSelect={true}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-100/30">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleAction}
            disabled={!selectedCourseId || isPending}
            className="px-8 py-2.5 rounded-xl color-primary-bg text-white font-bold hover:bg-[#1E90FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200 flex items-center gap-2"
          >
            {isPending && <FaCircleNotch className="animate-spin" />}
            {mode === "REFERRAL"
              ? "Gửi yêu cầu giới thiệu"
              : "Thêm vào khóa học"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralSelectionModal;
