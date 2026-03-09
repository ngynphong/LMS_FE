import { useState } from "react";
import {
  useCourseReferralRequests,
  useAcceptReferralRequest,
  useRejectReferralRequest,
} from "@/hooks/useStudentReferral";
import {
  FaCircleNotch,
  FaCheck,
  FaTimes,
  FaClock,
  FaUserGraduate,
  FaInbox,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { toast } from "@/components/common/Toast";
import { format } from "date-fns";
import PaginationControl from "@/components/common/PaginationControl";
import ReferralStudentListModal from "@/components/teacher/students/ReferralStudentListModal";
import type { ReferralRequestResponse } from "@/types/courseApi";

interface CourseReferralRequestsSectionProps {
  courseId: string;
}

const CourseReferralRequestsSection = ({
  courseId,
}: CourseReferralRequestsSectionProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<string>("PENDING");
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    courseName: string;
  } | null>(null);

  const {
    data: requestsData,
    isLoading,
    isFetching,
    refetch,
  } = useCourseReferralRequests(
    {
      courseId,
      pageNo: page - 1,
      pageSize,
      status: status === "ALL" ? undefined : status,
      sorts: ["createdAt:desc"],
    },
    { enabled: !!courseId },
  );

  const acceptMutation = useAcceptReferralRequest();
  const rejectMutation = useRejectReferralRequest();

  const handleAccept = async (requestId: string) => {
    try {
      await acceptMutation.mutateAsync(requestId);
      toast.success("Đã chấp nhận yêu cầu giới thiệu");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi chấp nhận yêu cầu");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectMutation.mutateAsync(requestId);
      toast.success("Đã từ chối yêu cầu giới thiệu");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi từ chối yêu cầu");
    }
  };

  const requests = requestsData?.data?.items || [];
  const totalPages = requestsData?.data?.totalPage || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0074bd]">
              transfer_within_a_station
            </span>
            Yêu cầu giới thiệu học sinh
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các yêu cầu giới thiệu học sinh từ giáo viên khác vào khóa
            học này.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit shrink-0">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                status === s
                  ? "bg-white color-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {s === "PENDING"
                ? "Chờ xử lý"
                : s === "APPROVED"
                  ? "Đã nhận"
                  : s === "REJECTED"
                    ? "Từ chối"
                    : "Tất cả"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
          <FaCircleNotch className="animate-spin text-3xl text-[#0074bd]" />
          <p className="text-sm font-medium">Đang tải danh sách yêu cầu...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="flex flex-col gap-4 transition-opacity duration-200 animate-in fade-in slide-in-from-bottom-2">
          <div
            className={`grid grid-cols-1 gap-4 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}
          >
            {requests.map((req: ReferralRequestResponse) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5 flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Sender Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0074bd]">
                          <span className="material-symbols-outlined">
                            person_pin
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 truncate">
                            {req.senderTeacherName}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            {req.senderTeacherEmail}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : req.status === "ACCEPTED"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {req.status === "PENDING"
                          ? "Chờ duyệt"
                          : req.status === "ACCEPTED"
                            ? "Đã nhận"
                            : req.status === "REJECTED"
                              ? "Từ chối"
                              : req.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-[13px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FaUserGraduate className="text-[#0074bd] text-xs" />
                        <span className="font-bold">{req.studentCount}</span>
                        <span>học sinh</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <FaClock className="text-slate-400 text-xs" />
                        <span>
                          {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm")}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRequest({
                            id: req.id,
                            courseName: "Khóa học hiện tại",
                          });
                          setShowStudentListModal(true);
                        }}
                        className="text-xs font-bold text-[#0074bd] hover:underline"
                      >
                        Xem danh sách học sinh
                      </button>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-[1.5] bg-slate-50 p-4 rounded-xl relative group">
                    <FaEnvelopeOpenText className="absolute -top-2 -left-2 text-slate-200 text-2xl group-hover:text-blue-100 transition-colors" />
                    <p className="text-sm text-slate-700 italic leading-relaxed line-clamp-2 md:line-clamp-3">
                      "{req.message || "Không có lời nhắn đi kèm."}"
                    </p>
                  </div>

                  {/* Actions */}
                  {req.status === "PENDING" && (
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleAccept(req.id)}
                        disabled={acceptMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0074bd] text-white rounded-xl text-sm font-bold hover:bg-[#0074bd]/90 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {acceptMutation.isPending ? (
                          <FaCircleNotch className="animate-spin" />
                        ) : (
                          <FaCheck />
                        )}
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={rejectMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {rejectMutation.isPending ? (
                          <FaCircleNotch className="animate-spin" />
                        ) : (
                          <FaTimes />
                        )}
                        Từ chối
                      </button>
                    </div>
                  )}

                  {req.status !== "PENDING" && (
                    <div className="shrink-0 flex items-center justify-center size-10 rounded-full bg-slate-100 text-slate-400">
                      <span className="material-symbols-outlined text-xl">
                        {req.status === "ACCEPTED" ? "verified" : "cancel"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 mt-2">
            <PaginationControl
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed gap-4 animate-in zoom-in duration-300">
          <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
            <FaInbox size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-400">
              Không có yêu cầu nào
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Các yêu cầu giới thiệu học sinh vào khóa học này sẽ hiện ở đây.
            </p>
          </div>
        </div>
      )}
      <ReferralStudentListModal
        isOpen={showStudentListModal}
        onClose={() => {
          setShowStudentListModal(false);
          setSelectedRequest(null);
        }}
        requestId={selectedRequest?.id || null}
        courseName={selectedRequest?.courseName}
        isIncoming={true}
      />
    </div>
  );
};

export default CourseReferralRequestsSection;
