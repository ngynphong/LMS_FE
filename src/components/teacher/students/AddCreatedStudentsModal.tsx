import { useState, useEffect } from "react";
import {
  useAddBatchStudents,
  useReferStudents,
  useMyStudentsNonEnrolled,
} from "@/hooks/useStudentReferral";
import {
  FaCircleNotch,
  FaSearch,
  FaTimes,
  FaFilter,
  FaCalendarAlt,
  FaSync,
} from "react-icons/fa";
import { getInitials } from "@/utils/initialsName";
import PaginationControl from "@/components/common/PaginationControl";
import { toast } from "@/components/common/Toast";

interface AddCreatedStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  isReferral?: boolean;
}

const AddCreatedStudentsModal = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  isReferral = false,
}: AddCreatedStudentsModalProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sorts, setSorts] = useState("createdAt:desc");

  // Format dates to YYYY-MM-DDTHH:mm:ss as required by the backend
  const formattedFromDate = fromDate ? `${fromDate}T00:00:00` : "";
  const formattedToDate = toDate ? `${toDate}T23:59:59` : "";

  const {
    data: studentsData,
    isLoading,
    isFetching,
  } = useMyStudentsNonEnrolled(courseId, {
    pageNo: page - 1,
    pageSize,
    keyword: debouncedKeyword,
    fromDate: formattedFromDate,
    toDate: formattedToDate,
    sorts: [sorts],
  });

  const addMutation = useAddBatchStudents();
  const referMutation = useReferStudents();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleResetFilters = () => {
    setKeyword("");
    setFromDate("");
    setToDate("");
    setSorts("createdAt:desc");
    setPage(1);
  };

  if (!isOpen) return null;

  const students = studentsData?.data?.items || [];
  const totalPages = studentsData?.data?.totalPage || 1;

  const handleAction = async () => {
    if (selectedIds.length === 0) return;

    try {
      if (isReferral) {
        await referMutation.mutateAsync({
          courseId,
          data: { studentIds: selectedIds, message },
        });
        toast.success("Đã gửi yêu cầu giới thiệu học sinh!");
      } else {
        await addMutation.mutateAsync({
          courseId,
          data: { studentIds: selectedIds },
        });
        toast.success("Đã thêm học sinh vào khóa học thành công!");
      }
      onClose();
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error.message || "Thao tác thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              {isReferral
                ? "Giới thiệu học sinh"
                : "Thêm học sinh từ danh sách của tôi"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {isReferral
                ? `Giới thiệu học sinh vào khóa học: ${courseName}`
                : `Khóa học: ${courseName}`}
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
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
          {/* Filters Section */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="date"
                    value={fromDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (toDate && value > toDate) {
                        toast.error("toDate không được lớn hơn fromDate");
                        return;
                      }
                      setFromDate(value);
                      setPage(1);
                    }}
                    className="pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all bg-white"
                  />
                </div>
                <span className="text-slate-400">—</span>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="date"
                    value={toDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (fromDate && value < fromDate) {
                        toast.error("toDate không được nhỏ hơn fromDate");
                        return;
                      }
                      setToDate(value);
                      setPage(1);
                    }}
                    className="pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <FaFilter className="text-[#0074bd] text-xs" />
                  <select
                    value={sorts}
                    onChange={(e) => {
                      setSorts(e.target.value);
                      setPage(1);
                    }}
                    className="text-sm font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="createdAt:desc">Mới nhất</option>
                    <option value="createdAt:asc">Cũ nhất</option>
                    <option value="firstName:asc">Tên (A-Z)</option>
                    <option value="firstName:desc">Tên (Z-A)</option>
                  </select>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-[#1E90FF] hover:bg-[#1E90FF]/5 rounded-lg transition-all text-xs font-bold border border-transparent hover:border-[#1E90FF]/20 cursor-pointer"
                >
                  <FaSync
                    className={`text-[10px] ${isFetching ? "animate-spin" : ""}`}
                  />
                  Làm mới
                </button>
              </div>

              <div className="text-sm font-medium text-slate-600 px-4 py-1.5 bg-[#1E90FF]/5 rounded-lg border border-[#1E90FF]/10">
                Đã chọn{" "}
                <span className="text-[#1E90FF] font-bold">
                  {selectedIds.length}
                </span>{" "}
                học sinh
              </div>
            </div>
          </div>

          {isReferral && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Lời nhắn (không bắt buộc)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập lời nhắn cho giáo viên của khóa học này..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm h-20 focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all resize-none"
              />
            </div>
          )}

          {/* Student List */}
          <div className="flex-1 border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50/30">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          students.length > 0 &&
                          selectedIds.length === students.length
                        }
                        onChange={(e) => {
                          if (e.target.checked)
                            setSelectedIds(students.map((s) => s.id));
                          else setSelectedIds([]);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                      />
                    </th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Học sinh
                    </th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-slate-100 bg-white transition-opacity ${isFetching ? "opacity-50" : ""}`}
                >
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        Đang tải...
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedIds.includes(student.id) ? "bg-blue-50/50" : ""}`}
                        onClick={() => {
                          setSelectedIds((prev) =>
                            prev.includes(student.id)
                              ? prev.filter((id) => id !== student.id)
                              : [...prev, student.id],
                          );
                        }}
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student.id)}
                            onChange={() => {
                              setSelectedIds((prev) =>
                                prev.includes(student.id)
                                  ? prev.filter((id) => id !== student.id)
                                  : [...prev, student.id],
                              );
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-[#1E90FF]/10 flex items-center justify-center text-[#1E90FF] font-bold text-xs border border-[#1E90FF]/20">
                              {getInitials(
                                `${student.lastName} ${student.firstName}`,
                              )}
                            </div>
                            <div className="font-bold text-slate-900 text-sm">
                              {student.lastName} {student.firstName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {student.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-500 font-medium"
                      >
                        Bạn chưa tạo học sinh nào hoặc không tìm thấy kết quả
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white border-t border-slate-200 px-6 py-3">
              <PaginationControl
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 20, 50, 100, 1000]}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all shrink-0 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleAction}
            disabled={
              selectedIds.length === 0 ||
              addMutation.isPending ||
              referMutation.isPending
            }
            className="px-8 py-2.5 rounded-xl color-primary-bg text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            {(addMutation.isPending || referMutation.isPending) && (
              <FaCircleNotch className="animate-spin" />
            )}
            {isReferral ? "Gửi yêu cầu" : "Thêm vào khóa học"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCreatedStudentsModal;
