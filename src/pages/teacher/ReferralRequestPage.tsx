import { useState } from "react";
import {
  useMySentReferralRequests,
  useCancelReferralRequest,
  useMyReceivedReferralRequests,
  useAcceptReferralRequest,
  useRejectReferralRequest,
} from "@/hooks/useStudentReferral";
import {
  FaCircleNotch,
  FaClock,
  FaTimesCircle,
  FaPaperPlane,
  FaInbox,
  FaGraduationCap,
  FaCheck,
  FaTimes,
  FaUserGraduate,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { toast } from "@/components/common/Toast";
import { format } from "date-fns";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import ReferralStudentListModal from "@/components/teacher/students/ReferralStudentListModal";
import PaginationControl from "@/components/common/PaginationControl";
import type { ReferralRequestResponse } from "@/types/courseApi";
import { MdCancel, MdPersonPin } from "react-icons/md";

const ReferralRequestPage = () => {
  const [activeTab, setActiveTab] = useState<"outgoing" | "incoming">(
    "incoming",
  );

  // ====== OUTGOING FILTERS ======
  const [sentStatus, setSentStatus] = useState("ALL");
  const [sentFromDate, setSentFromDate] = useState("");
  const [sentToDate, setSentToDate] = useState("");
  const [sentPage, setSentPage] = useState(0);

  const sentParams = {
    status: sentStatus === "ALL" ? undefined : sentStatus,
    fromDate: sentFromDate ? `${sentFromDate}T00:00:00` : undefined,
    toDate: sentToDate ? `${sentToDate}T23:59:59` : undefined,
    pageNo: sentPage,
    pageSize: 10,
    sorts: ["createdAt:desc"],
  };

  const {
    data: sentData,
    isLoading: sentLoading,
    isFetching: sentFetching,
  } = useMySentReferralRequests(sentParams);

  const sentRequests: ReferralRequestResponse[] =
    (sentData as any)?.data?.items || [];
  const sentTotalPages = (sentData as any)?.data?.totalPage || 0;

  // ====== INCOMING FILTERS ======
  const [incomingStatus, setIncomingStatus] = useState("ALL");
  const [incomingFromDate, setIncomingFromDate] = useState("");
  const [incomingToDate, setIncomingToDate] = useState("");
  const [incomingPage, setIncomingPage] = useState(0);

  const incomingParams = {
    status: incomingStatus === "ALL" ? undefined : incomingStatus,
    fromDate: incomingFromDate ? `${incomingFromDate}T00:00:00` : undefined,
    toDate: incomingToDate ? `${incomingToDate}T23:59:59` : undefined,
    pageNo: incomingPage,
    pageSize: 10,
    sorts: ["createdAt:desc"],
  };

  const {
    data: receivedData,
    isLoading: receivedLoading,
    isFetching: receivedFetching,
  } = useMyReceivedReferralRequests(incomingParams);

  const receivedRequests: ReferralRequestResponse[] =
    (receivedData as any)?.data?.items || [];
  const receivedTotalPages = (receivedData as any)?.data?.totalPage || 0;

  // ====== MODALS ======
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestIdToCancel, setRequestIdToCancel] = useState<string | null>(
    null,
  );
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    id: string;
    courseName: string;
  } | null>(null);
  const [isIncomingModal, setIsIncomingModal] = useState(false);

  const cancelMutation = useCancelReferralRequest();
  const acceptMutation = useAcceptReferralRequest();
  const rejectMutation = useRejectReferralRequest();

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
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Không thể hủy yêu cầu";
      toast.error(errMsg);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptMutation.mutateAsync(requestId);
      toast.success("Đã chấp nhận yêu cầu giới thiệu");
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Lỗi khi chấp nhận yêu cầu";
      toast.error(errMsg);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectMutation.mutateAsync(requestId);
      toast.success("Đã từ chối yêu cầu giới thiệu");
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Lỗi khi từ chối yêu cầu";
      toast.error(errMsg);
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");

  // ====== FILTER BAR COMPONENT ======
  const FilterBar = ({
    status,
    setStatus,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    setPage,
    statusOptions,
  }: {
    status: string;
    setStatus: (s: string) => void;
    fromDate: string;
    setFromDate: (d: string) => void;
    toDate: string;
    setToDate: (d: string) => void;
    setPage: (p: number) => void;
    statusOptions: { value: string; label: string }[];
  }) => (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
      {/* Status tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setStatus(opt.value);
              setPage(0);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              status === opt.value
                ? "bg-white color-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Date filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-bold text-slate-500">Từ:</label>
          <input
            type="date"
            value={fromDate}
            max={toDate || today}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(0);
            }}
            className="px-3 py-1.5 text-gray-500 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-bold text-slate-500">Đến:</label>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            max={today}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(0);
            }}
            className="px-3 py-1.5 text-gray-500 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] focus:outline-none"
          />
        </div>
        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setPage(0);
            }}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            Xóa lọc
          </button>
        )}
      </div>
    </div>
  );

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
          <FilterBar
            status={sentStatus}
            setStatus={setSentStatus}
            fromDate={sentFromDate}
            setFromDate={setSentFromDate}
            toDate={sentToDate}
            setToDate={setSentToDate}
            setPage={setSentPage}
            statusOptions={[
              { value: "ALL", label: "Tất cả" },
              { value: "PENDING", label: "Chờ xử lý" },
              { value: "APPROVED", label: "Được duyệt" },
              { value: "REJECTED", label: "Từ chối" },
            ]}
          />

          {sentLoading ? (
            <div className="flex justify-center py-20">
              <FaCircleNotch className="animate-spin text-3xl color-primary" />
            </div>
          ) : sentRequests.length > 0 ? (
            <div
              className={`space-y-4 transition-opacity ${sentFetching ? "opacity-50" : ""}`}
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {sentRequests.map((req: ReferralRequestResponse) => (
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
                            setIsIncomingModal(false);
                            setShowStudentListModal(true);
                          }}
                          className="text-xs font-bold color-primary hover:underline cursor-pointer"
                        >
                          Xem danh sách
                        </button>
                      </div>
                      {req.message && (
                        <div className="text-xs text-slate-500 italic bg-blue-50/30 p-3 rounded-xl border border-blue-50 leading-relaxed">
                          &quot;{req.message}&quot;
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
                ))}
              </div>

              {sentTotalPages > 1 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 mt-2">
                  <PaginationControl
                    currentPage={sentPage + 1}
                    totalPages={sentTotalPages}
                    onPageChange={(p) => setSentPage(p - 1)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              <FaPaperPlane className="text-4xl mx-auto mb-4 opacity-10" />
              <p className="font-medium">Không có yêu cầu nào.</p>
            </div>
          )}
        </div>
      ) : (
        /* ====== INCOMING TAB ====== */
        <div className="space-y-4">
          <FilterBar
            status={incomingStatus}
            setStatus={setIncomingStatus}
            fromDate={incomingFromDate}
            setFromDate={setIncomingFromDate}
            toDate={incomingToDate}
            setToDate={setIncomingToDate}
            setPage={setIncomingPage}
            statusOptions={[
              { value: "ALL", label: "Tất cả" },
              { value: "PENDING", label: "Chờ xử lý" },
              { value: "ACCEPTED", label: "Đã nhận" },
              { value: "REJECTED", label: "Từ chối" },
            ]}
          />

          {receivedLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
              <FaCircleNotch className="animate-spin text-3xl text-[#0074bd]" />
              <p className="text-sm font-medium">
                Đang tải danh sách yêu cầu...
              </p>
            </div>
          ) : receivedRequests.length > 0 ? (
            <div
              className={`space-y-4 transition-opacity ${receivedFetching ? "opacity-50" : ""}`}
            >
              <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {receivedRequests.map((req: ReferralRequestResponse) => (
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
                              <span className="text-xl">
                                <MdPersonPin />
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

                        {/* Course name */}
                        {req.courseName && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mb-2">
                            <FaGraduationCap className="text-[#0074bd] text-xs" />
                            <span className="font-bold text-slate-800">
                              {req.courseName}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-[13px]">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <FaUserGraduate className="text-[#0074bd] text-xs" />
                            <span className="font-bold">
                              {req.studentCount}
                            </span>
                            <span>học sinh</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <FaClock className="text-slate-400 text-xs" />
                            <span>
                              {format(
                                new Date(req.createdAt),
                                "dd/MM/yyyy HH:mm",
                              )}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRequest({
                                id: req.id,
                                courseName: req.courseName || "Khóa học",
                              });
                              setIsIncomingModal(true);
                              setShowStudentListModal(true);
                            }}
                            className="text-xs font-bold text-[#0074bd] hover:underline cursor-pointer"
                          >
                            Xem danh sách học sinh
                          </button>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex-[1.5] bg-slate-50 p-4 rounded-xl relative group">
                        <FaEnvelopeOpenText className="absolute -top-2 -left-2 text-slate-200 text-2xl group-hover:text-blue-100 transition-colors" />
                        <p className="text-sm text-slate-700 italic leading-relaxed line-clamp-2 md:line-clamp-3">
                          &quot;
                          {req.message || "Không có lời nhắn đi kèm."}
                          &quot;
                        </p>
                      </div>

                      {/* Actions */}
                      {req.status === "PENDING" && (
                        <div className="flex md:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleAccept(req.id)}
                            disabled={acceptMutation.isPending}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0074bd] text-white rounded-xl text-sm font-bold hover:bg-[#0074bd]/90 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
                          <span className="text-xl">
                            {req.status === "ACCEPTED" ? (
                              <FaCheck />
                            ) : (
                              <MdCancel />
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {receivedTotalPages > 1 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 mt-2">
                  <PaginationControl
                    currentPage={incomingPage + 1}
                    totalPages={receivedTotalPages}
                    onPageChange={(p) => setIncomingPage(p - 1)}
                  />
                </div>
              )}
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
                  Các yêu cầu giới thiệu học sinh sẽ hiện ở đây.
                </p>
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
        isIncoming={isIncomingModal}
      />
    </div>
  );
};

export default ReferralRequestPage;
