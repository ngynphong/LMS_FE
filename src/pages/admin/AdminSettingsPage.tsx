import { useState } from "react";
import { useSystemLogs } from "../../hooks/useAdmin";
import { format } from "date-fns";
import {
  MdSettings,
  MdHistory,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"general" | "logs">("logs");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: logsData, isLoading, isError } = useSystemLogs(page, pageSize);

  const handleTabChange = (tab: "general" | "logs") => {
    setActiveTab(tab);
  };

  const totalPages = logsData?.data.totalPage || 1;

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#101518]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#101518] tracking-tight">
          Cài đặt hệ thống
        </h2>
        <p className="text-[#5e7c8d] text-sm">
          Quản lý cấu hình và theo dõi hoạt động hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => handleTabChange("general")}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "general"
              ? "border-[#0078bd] text-[#0078bd]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <MdSettings className="text-lg" />
          Cài đặt chung
        </button>
        <button
          onClick={() => handleTabChange("logs")}
          className={`px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "logs"
              ? "border-[#0078bd] text-[#0078bd]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <MdHistory className="text-lg" />
          Logs hệ thống
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        {activeTab === "general" && (
          <div className="p-8 text-center text-slate-500">
            <MdSettings className="text-6xl mx-auto mb-4 text-slate-200" />
            <p className="text-lg font-medium">
              Cấu hình hệ thống (Coming Soon)
            </p>
            <p className="text-sm">Tính năng đang được phát triển...</p>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="p-0">
            {/* Table Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-[#101518]">Nhật ký hoạt động</h3>
              <span className="text-xs text-slate-500">
                Trang {page} / {totalPages}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="size-8 border-2 border-[#0078bd]/30 border-t-[#0078bd] rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-500">Đang tải dữ liệu...</p>
                </div>
              ) : isError ? (
                <div className="p-12 text-center text-red-500">
                  <p>Không thể tải dữ liệu logs. Vui lòng thử lại sau.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Thời gian</th>
                      <th className="px-6 py-4 whitespace-nowrap">
                        Người thực hiện
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap">Hành động</th>
                      <th className="px-6 py-4 whitespace-nowrap">Endpoint</th>
                      <th className="px-6 py-4 whitespace-nowrap">
                        IP Address
                      </th>
                      <th className="px-6 py-4 whitespace-nowrap">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logsData?.data?.items?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          Không có dữ liệu logs nào.
                        </td>
                      </tr>
                    ) : (
                      logsData?.data.items.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-600">
                            {format(
                              new Date(log.timestamp),
                              "dd/MM/yyyy HH:mm:ss",
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-[#101518]">
                            {log.actor}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-100">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            <span
                              className={`mr-2 font-bold ${
                                log.method === "GET"
                                  ? "text-green-600"
                                  : log.method === "POST"
                                    ? "text-blue-600"
                                    : log.method === "PUT"
                                      ? "text-orange-600"
                                      : log.method === "DELETE"
                                        ? "text-red-600"
                                        : "text-slate-600"
                              }`}
                            >
                              {log.method}
                            </span>
                            {log.endpoint}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {log.ipAddress}
                          </td>
                          <td className="px-6 py-4">
                            {log.success ? (
                              <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                <span className="size-1.5 rounded-full bg-green-500"></span>
                                Success
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
                                <span className="size-1.5 rounded-full bg-red-500"></span>
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {logsData?.data && logsData.data.totalPage > 1 && (
              <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <MdNavigateBefore className="text-xl" />
                </button>
                <div className="flex items-center px-4 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg border border-slate-200">
                  Trang {page}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <MdNavigateNext className="text-xl" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
