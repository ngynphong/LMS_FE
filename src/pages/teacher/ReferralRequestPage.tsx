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
} from "react-icons/fa";
import { toast } from "@/components/common/Toast";
import { format } from "date-fns";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import ReferralStudentListModal from "@/components/teacher/students/ReferralStudentListModal";
import type { ReferralRequestResponse } from "@/types/courseApi";

const ReferralRequestPage = () => {
  const [activeTab, setActiveTab] = useState<"outgoing" | "incoming">(
    "outgoing",
  );
  const {
    data: sentRequests,
    isLoading: sentLoading,
    refetch: refetchSent,
  } = useMySentReferralRequests();
  const { data: myCoursesData } = useMyCourses({ pageSize: 100 });

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
          onClick={() => setActiveTab("outgoing")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "outgoing"
              ? "color-primary-bg text-white shadow-md"
              : "text-slate-500"
          }`}
        >
          <FaPaperPlane className="text-xs" /> Yêu cầu đã gửi (Outgoing)
        </button>
      </div>

      {activeTab === "outgoing" ? (
        <div className="space-y-4">
          {sentLoading ? (
            <div className="flex justify-center py-20">
              <FaCircleNotch className="animate-spin text-3xl" />
            </div>
          ) : (sentRequests as any)?.data?.items?.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {(sentRequests as any).data.items.map(
                (req: ReferralRequestResponse) => (
                  <div key={req.id} className="bg-white rounded-2xl border p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-[#0074bd]">
                          {req.courseName || "Khóa học"}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <FaClock />{" "}
                          {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : req.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {req.status === "APPROVED"
                          ? "Đã duyệt"
                          : req.status === "REJECTED"
                            ? "Từ chối"
                            : "Chờ xử lý"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-semibold">Người nhận:</span>
                        <span>{req.targetTeacherName}</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                        <div className="text-sm font-medium">
                          {req.studentCount} học sinh được giới thiệu
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRequest({
                              id: req.id,
                              courseName: req.courseName || "",
                            });
                            setShowStudentListModal(true);
                          }}
                          className="text-xs font-bold text-[#0074bd] hover:underline"
                        >
                          Xem danh sách
                        </button>
                      </div>
                      {req.message && (
                        <div className="text-xs text-slate-500 italic bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                          "{req.message}"
                        </div>
                      )}
                    </div>

                    {req.status === "PENDING" && (
                      <div className="flex justify-end pt-4 mt-2 border-t border-dashed border-slate-100">
                        <button
                          onClick={() => handleCancelClick(req.id)}
                          disabled={cancelMutation.isPending}
                          className="px-4 py-2 text-rose-600 text-xs font-bold hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors"
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
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed">
              Bạn chưa gửi yêu cầu nào.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-8 text-center min-h-[300px] flex flex-col justify-center">
          <FaInbox className="text-4xl text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800">
            Tính năng đang phát triển
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Bạn có thể chọn khóa học của mình để xem danh sách yêu cầu chuyển
            đến.
          </p>
          <div className="pt-4 max-w-sm mx-auto w-full">
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0074bd]/20 outline-none transition-all text-sm">
              <option value="">--- Chọn khóa học ---</option>
              {(myCoursesData as any)?.items?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
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
