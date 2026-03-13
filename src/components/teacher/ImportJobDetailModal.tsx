import { useState } from "react";
import { FaCircleNotch, FaTimes } from "react-icons/fa";
import { useImportJob, useImportJobErrors } from "@/hooks/useTeacher";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

interface ImportJobDetailModalProps {
  jobId: string;
  onClose: () => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Đang chờ", color: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Hoàn tất", color: "bg-green-100 text-green-700" },
  FAILED: { label: "Thất bại", color: "bg-red-100 text-red-700" },
};

export const ImportJobDetailModal = ({
  jobId,
  onClose,
}: ImportJobDetailModalProps) => {
  const { data: job, isLoading: loadingJob } = useImportJob(jobId);
  const [showErrors, setShowErrors] = useState(false);
  const [errorPage, setErrorPage] = useState(0);

  const { data: errorsData, isLoading: loadingErrors } = useImportJobErrors(
    showErrors ? jobId : null,
    errorPage,
    10,
  );

  const statusInfo = statusMap[job?.status || ""] || statusMap.PENDING;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">Chi tiết Import</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loadingJob ? (
            <div className="flex justify-center py-8">
              <FaCircleNotch className="animate-spin text-2xl color-primary" />
            </div>
          ) : job ? (
            <div className="space-y-5">
              {/* Status & File */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                <span className="text-xs text-gray-500">
                  {job.completedAt
                    ? format(new Date(job.completedAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })
                    : "—"}
                </span>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tên file</span>
                  <span className="text-gray-900 font-medium truncate ml-4 max-w-[200px]">
                    {job.fileName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kích thước</span>
                  <span className="text-gray-900 font-medium">
                    {(job.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {job.totalRows}
                  </p>
                  <p className="text-xs text-blue-500 font-medium mt-1">
                    Tổng dòng
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {job.successCount}
                  </p>
                  <p className="text-xs text-green-500 font-medium mt-1">
                    Thành công
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {job.errorCount}
                  </p>
                  <p className="text-xs text-red-500 font-medium mt-1">Lỗi</p>
                </div>
              </div>

              {/* Failure Reason */}
              {job.failureReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">
                    Lý do lỗi
                  </p>
                  <p className="text-sm text-red-600">{job.failureReason}</p>
                </div>
              )}

              {/* Error Details Toggle */}
              {job.errorCount > 0 && (
                <div>
                  <button
                    onClick={() => setShowErrors(!showErrors)}
                    className="w-full text-sm font-semibold color-primary cursor-pointer flex items-center justify-center gap-1 py-2"
                  >
                    <span className="text-base">
                      {showErrors ? <MdExpandLess /> : <MdExpandMore />}
                    </span>
                    {showErrors
                      ? "Ẩn chi tiết lỗi"
                      : `Xem chi tiết ${job.errorCount} lỗi`}
                  </button>

                  {showErrors && (
                    <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                      {loadingErrors ? (
                        <div className="flex justify-center py-6">
                          <FaCircleNotch className="animate-spin text-lg color-primary" />
                        </div>
                      ) : errorsData?.content &&
                        errorsData.content.length > 0 ? (
                        <>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">
                                  Dòng
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">
                                  Email
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">
                                  Lỗi
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {errorsData.content.map((err, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-gray-700 font-medium">
                                    {err.rowNumber}
                                  </td>
                                  <td className="px-3 py-2 text-gray-600 truncate max-w-[120px]">
                                    {err.email || "—"}
                                  </td>
                                  <td className="px-3 py-2 text-red-600">
                                    {err.errorMessage}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Pagination */}
                          {errorsData.totalPages > 1 && (
                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                              <span className="text-xs text-gray-500">
                                Trang {errorPage + 1} / {errorsData.totalPages}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() =>
                                    setErrorPage((p) => Math.max(0, p - 1))
                                  }
                                  disabled={errorPage === 0}
                                  className="px-2 py-1 text-xs rounded border disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
                                >
                                  Trước
                                </button>
                                <button
                                  onClick={() =>
                                    setErrorPage((p) =>
                                      Math.min(
                                        errorsData.totalPages - 1,
                                        p + 1,
                                      ),
                                    )
                                  }
                                  disabled={
                                    errorPage >= errorsData.totalPages - 1
                                  }
                                  className="px-2 py-1 text-xs rounded border disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
                                >
                                  Sau
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-center text-gray-500 text-sm py-4">
                          Không có dữ liệu lỗi
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Không tìm thấy thông tin import job
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
