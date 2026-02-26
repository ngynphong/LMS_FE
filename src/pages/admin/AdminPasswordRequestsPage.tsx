import { useState } from "react";
import {
  useGetBatchResetPasswordRequests,
  useApproveBatchResetPassword,
} from "../../hooks/useBatchPasswordReset";
import PaginationControl from "../../components/common/PaginationControl";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { toast } from "../../components/common/Toast";

const AdminPasswordRequestsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [action, setAction] = useState<"APPROVE" | "REJECT">("APPROVE");
  const { data, isLoading, isError, error, refetch } =
    useGetBatchResetPasswordRequests({
      pageNo: currentPage,
      pageSize,
      sorts: ["createdAt,desc"], // Provide sorts cautiously, backend standard. We'll leave it empty unless needed. Let's omit sorts, wait maybe just pageNo, pageSize.
    });

  const approveMutation = useApproveBatchResetPassword();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && data?.data?.items) {
      setSelectedEmails(data.data.items.map((item) => item.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectRequest = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleApprove = () => {
    if (selectedEmails.length === 0) return;
    setAction("APPROVE");
    setIsConfirmOpen(true);
  };

  const handleReject = () => {
    if (selectedEmails.length === 0) return;
    setAction("REJECT");
    setIsConfirmOpen(true);
  };

  const executeApprove = () => {
    approveMutation.mutate(
      { userEmails: selectedEmails, action },
      {
        onSuccess: (res) => {
          if (action === "APPROVE") {
            toast.success(
              res.data ||
                res.message ||
                "Đã duyệt đặt lại mật khẩu thành công!",
            );
          } else {
            toast.success(
              res.data || res.message || "Đã từ chối yêu cầu thành công!",
            );
          }
          setSelectedEmails([]);
          setIsConfirmOpen(false);
          refetch();
        },
        onError: (err) => {
          toast.error("Lỗi: " + err.message);
          setIsConfirmOpen(false);
        },
      },
    );
  };

  const requests = data?.data?.items || [];
  const totalPages = data?.data?.totalPage || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-2xl text-blue-600">
            progress_activity
          </span>
          <span className="text-slate-600">Đang tải danh sách yêu cầu...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-4xl text-red-500">
          error
        </span>
        <p className="text-slate-600">
          Không tìm thấy danh sách yêu cầu. {error?.message}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Yêu cầu đặt lại mật khẩu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các yêu cầu đặt lại mật khẩu hàng loạt từ giáo viên
          </p>
        </div>
        {selectedEmails.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              disabled={approveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                cancel
              </span>
              Từ chối ({selectedEmails.length})
            </button>
            <button
              onClick={handleApprove}
              disabled={approveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              {approveMutation.isPending && action === "APPROVE"
                ? "Đang xử lý..."
                : "Duyệt Yêu cầu"}{" "}
              ({selectedEmails.length})
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="px-6 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        requests.length > 0 &&
                        requests.every((r) => selectedEmails.includes(r.email))
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Học viên</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Ngày sinh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(request.email)}
                        onChange={() => handleSelectRequest(request.email)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            request.imgUrl ||
                            `https://ui-avatars.com/api/?name=${request.firstName}+${request.lastName}&background=random`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200"
                        />
                        <div className="font-medium text-slate-900">
                          {request.firstName} {request.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {request.dob || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
              task_alt
            </span>
            <p className="text-lg font-medium text-slate-600">
              Không có yêu cầu nào
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Tuyệt vời, tất cả các yêu cầu reset mật khẩu đã được xử lý.
            </p>
          </div>
        )}

        {requests.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeApprove}
        title={action === "APPROVE" ? "Duyệt yêu cầu" : "Từ chối yêu cầu"}
        message={
          action === "APPROVE"
            ? `Xác nhận duyệt reset mật khẩu cho ${selectedEmails.length} yêu cầu?`
            : `Xác nhận từ chối ${selectedEmails.length} yêu cầu reset mật khẩu?`
        }
        confirmLabel={action === "APPROVE" ? "Duyệt yêu cầu" : "Từ chối"}
        cancelLabel="Hủy"
        isLoading={approveMutation.isPending}
        variant={action === "APPROVE" ? "warning" : "danger"}
      />
    </div>
  );
};

export default AdminPasswordRequestsPage;
