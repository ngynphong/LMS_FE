import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCircleNotch } from "react-icons/fa";
import { useEnrollCourse } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/common/Toast";

interface EnrollmentModalProps {
  courseId: string;
  courseVisibility: string | null;
  onClose: () => void;
}

const EnrollmentModal = ({
  courseId,
  courseVisibility,
  onClose,
}: EnrollmentModalProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutateAsync: enroll, isPending: enrolling } = useEnrollCourse();
  const [enrollmentCode, setEnrollmentCode] = useState("");

  const isPublicCourse = courseVisibility === "PUBLIC";

  const handleEnrollSubmit = async () => {
    if (!courseId) return;
    if (!isPublicCourse && !enrollmentCode) return;

    try {
      await enroll({
        courseId,
        data: isPublicCourse ? {} : { enrollmentCode },
      });
      toast.success("Tham gia khóa học thành công!");
      onClose();
      navigate(`/courses/${courseId}`);
    } catch {
      toast.error(
        isPublicCourse
          ? "Không thể tham gia khóa học."
          : "Mã tham gia không hợp lệ hoặc hết hạn.",
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-bold text-gray-900">
            Vui lòng đăng nhập để tham gia khóa học
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Để tham gia khóa học, vui lòng đăng nhập tài khoản của bạn.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:translate-y-[-2px] transition-all duration-300 rounded-lg"
            >
              Hủy
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-bold text-white color-primary-bg hover:translate-y-[-2px] transition-all duration-300 rounded-lg"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Tham gia khóa học</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isPublicCourse ? (
          <p className="text-sm text-gray-600 mb-6">
            Khóa học này là công khai. Bạn có thể tham gia ngay mà không cần mã.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Vui lòng nhập mã tham gia được cung cấp bởi giảng viên để ghi danh
              vào khóa học này.
            </p>

            <div className="mb-6">
              <input
                type="text"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value)}
                placeholder="Nhập mã tham gia..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF]"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:translate-y-[-2px] transition-all duration-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleEnrollSubmit}
            disabled={enrolling || (!isPublicCourse && !enrollmentCode)}
            className="px-4 py-2 text-sm font-bold text-white color-primary-bg hover:translate-y-[-2px] transition-all duration-300 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {enrolling && (
              <span className="animate-spin text-sm">
                <FaCircleNotch />
              </span>
            )}
            Tham gia ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
