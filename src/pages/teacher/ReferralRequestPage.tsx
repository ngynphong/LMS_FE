import { useState } from "react";
import {
  useMySentReferralRequests,
  useCancelReferralRequest,
} from "@/hooks/useStudentReferral";
import { useMyCourses } from "@/hooks/useCourses";
import {
  FaCircleNotch,
  FaClock,
  FaTimesCircle,
  FaPaperPlane,
  FaInbox,
  FaArrowLeft,
  FaGraduationCap,
} from "react-icons/fa";
import { toast } from "@/components/common/Toast";
import { format } from "date-fns";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import ReferralStudentListModal from "@/components/teacher/students/ReferralStudentListModal";
import type { ReferralRequestResponse } from "@/types/courseApi";
import CourseReferralRequestsSection from "@/components/teacher/courses/CourseReferralRequestsSection";

const ReferralRequestPage = () => {
  const [activeTab, setActiveTab] = useState<"outgoing" | "incoming">(
    "outgoing",
  );
  const {
    data: sentRequests,
    isLoading: sentLoading,
    refetch: refetchSent,
  } = useMySentReferralRequests();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");

  const { data: myCoursesData, isLoading: coursesLoading } = useMyCourses({
    pageSize: 100,
    status: "PUBLISHED",
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestIdToCancel, setRequestIdToCancel] = useState<string | null>(
    null,
  );

  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    courseName: string;
  } | null>(null);

  const cancelMutation = useCancelReferralRequest();

  const handleCancelClick = (id: string) => {
    setRequestIdToCancel(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!requestIdToCancel) return;
    try {
      await cancelMutation.mutateAsync(requestIdToCancel);
      toast.success("Đã hủy yêu cầu thành công");
      setShowCancelModal(false);
      setRequestIdToCancel(null);
      refetchSent();
    } catch (error: any) {
      toast.error(error.message || "Không thể hủy yêu cầu");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Quản lý yêu cầu giới thiệu
        </h1>
        <p className="text-slate-500 text-sm">
          Theo dõi và xử lý các yêu cầu giới thiệu học sinh vào khóa học.
        </p>
      </div>

      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => {
            setActiveTab("outgoing");
            setSelectedCourseId(null);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "outgoing"
              ? "color-primary-bg text-white shadow-md font-black"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FaPaperPlane className="text-xs" /> Yêu cầu đã gửi
        </button>
        <button
          onClick={() => setActiveTab("incoming")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "incoming"
              ? "color-primary-bg text-white shadow-md font-black"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <FaInbox className="text-xs" /> Yêu cầu nhận được
        </button>
      </div>

      {activeTab === "outgoing" ? (
        <div className="space-y-4">
          {sentLoading ? (
            <div className="flex justify-center py-20">
              <FaCircleNotch className="animate-spin text-3xl color-primary" />
            </div>
          ) : (sentRequests as any)?.data?.items?.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {(sentRequests as any).data.items.map(
                (req: ReferralRequestResponse) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold color-primary text-base">
                          {req.courseName || "Khóa học"}
                        </h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                          <FaClock className="text-[10px]" />{" "}
                          {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : req.status === "APPROVED" ||
                                req.status === "ACCEPTED"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}
                      >
                        {req.status === "APPROVED" || req.status === "ACCEPTED"
                          ? "Đã duyệt"
                          : req.status === "REJECTED"
                            ? "Từ chối"
                            : "Chờ xử lý"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <span className="text-slate-400">Người nhận:</span>
                        <span className="text-slate-900">
                          {req.targetTeacherName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <FaGraduationCap className="color-primary" />
                          {req.studentCount} học sinh
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRequest({
                              id: req.id,
                              courseName: req.courseName || "",
                            });
                            setShowStudentListModal(true);
                          }}
                          className="text-xs font-bold color-primary hover:underline cursor-pointer"
                        >
                          Xem danh sách
                        </button>
                      </div>
                      {req.message && (
                        <div className="text-xs text-slate-500 italic bg-blue-50/30 p-3 rounded-xl border border-blue-50 leading-relaxed">
                          "{req.message}"
                        </div>
                      )}
                    </div>

                    {req.status === "PENDING" && (
                      <div className="flex justify-end pt-4 mt-2 border-t border-dashed border-slate-100">
                        <button
                          onClick={() => handleCancelClick(req.id)}
                          disabled={cancelMutation.isPending}
                          className="px-4 py-2 text-rose-500 text-xs font-bold hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <FaTimesCircle /> Hủy yêu cầu
                        </button>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              <FaPaperPlane className="text-4xl mx-auto mb-4 opacity-10" />
              <p className="font-medium">Bạn chưa gửi yêu cầu nào.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {!selectedCourseId ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center min-h-[400px] flex flex-col justify-center animate-in fade-in duration-500">
              <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <FaInbox className="text-4xl" />
              </div>
              <h3 className="font-black text-xl text-slate-800 mb-2">
                Yêu cầu giới thiệu đến (Incoming)
              </h3>
              <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                Vui lòng chọn một khóa học của bạn để quản lý các yêu cầu giới
                thiệu học sinh từ giáo viên khác.
              </p>

              <div className="max-w-md mx-auto w-full relative">
                {coursesLoading ? (
                  <div className="py-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                    <FaCircleNotch className="animate-spin" /> Đang tải danh
                    sách khóa học...
                  </div>
                ) : (
                  <select
                    onChange={(e) => {
                      const courseId = e.target.value;
                      if (!courseId) return;
                      setSelectedCourseId(courseId);
                      const course = (myCoursesData as any)?.items?.find(
                        (c: any) => c.id === courseId,
                      );
                      setSelectedCourseName(course?.name || "");
                    }}
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all text-sm font-bold bg-[#fcfdfe] cursor-pointer appearance-none shadow-sm"
                  >
                    <option value="">--- Chọn khóa học để quản lý ---</option>
                    {(myCoursesData as any)?.items?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedCourseId(null)}
                  className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                >
                  <FaArrowLeft className="text-sm" />
                </button>
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-slate-900 truncate">
                    {selectedCourseName}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    Quản lý yêu cầu đến
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <CourseReferralRequestsSection courseId={selectedCourseId} />
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Hủy yêu cầu giới thiệu"
        message="Bạn có chắc chắn muốn hủy yêu cầu này? Hành động này không thể hoàn tác."
        confirmLabel="Tiếp tục hủy"
        cancelLabel="Quay lại"
        isLoading={cancelMutation.isPending}
        variant="danger"
      />

      <ReferralStudentListModal
        isOpen={showStudentListModal}
        onClose={() => {
          setShowStudentListModal(false);
          setSelectedRequest(null);
        }}
        requestId={selectedRequest?.id || null}
        courseName={selectedRequest?.courseName}
      />
    </div>
  );
};

export default ReferralRequestPage;
