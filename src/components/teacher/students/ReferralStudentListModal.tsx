import { FaTimes, FaCircleNotch, FaUser, FaTrash } from "react-icons/fa";
import {
  useReferralRequestStudents,
  useRemoveStudentsFromReferral,
  useRejectStudentsInReferral,
} from "@/hooks/useStudentReferral";
import PaginationControl from "@/components/common/PaginationControl";
import { useState } from "react";
import { toast } from "@/components/common/Toast";

interface ReferralStudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  courseName?: string;
  isIncoming?: boolean;
}

const ReferralStudentListModal = ({
  isOpen,
  onClose,
  requestId,
  courseName,
  isIncoming = false,
}: ReferralStudentListModalProps) => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading } = useReferralRequestStudents(requestId || "", {
    pageNo: page - 1,
    pageSize: 10,
  });

  const removeMutation = useRemoveStudentsFromReferral();
  const rejectMutation = useRejectStudentsInReferral();

  if (!isOpen) return null;

  const students = data?.data?.items || [];
  const totalPages = data?.data?.totalPage || 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(students.map((s: any) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleRemove = async () => {
    if (selectedIds.length === 0 || !requestId) return;

    try {
      if (isIncoming) {
        await rejectMutation.mutateAsync({
          requestId,
          studentIds: selectedIds,
        });
      } else {
        await removeMutation.mutateAsync({
          requestId,
          studentIds: selectedIds,
        });
      }
      toast.success(`Đã xóa ${selectedIds.length} học sinh thành công`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa học sinh");
    }
  };

  const isMutating = removeMutation.isPending || rejectMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              Danh sách học sinh
            </h3>
            {courseName && (
              <p className="text-xs text-slate-500 mt-0.5">
                Khóa học:{" "}
                <span className="font-medium text-[#0074bd]">{courseName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 flex-1 min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
              <FaCircleNotch className="animate-spin text-3xl text-[#0074bd]" />
              <p className="text-sm text-slate-400">Đang tải danh sách...</p>
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === students.length &&
                      students.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0074bd] focus:ring-[#0074bd]"
                  />
                  <span className="text-xs font-medium text-slate-500">
                    Chọn tất cả ({selectedIds.length}/{students.length})
                  </span>
                </div>

                {selectedIds.length > 0 && (
                  <button
                    onClick={handleRemove}
                    disabled={isMutating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                  >
                    {isMutating ? (
                      <FaCircleNotch className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                    Xóa khỏi danh sách
                  </button>
                )}
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {students.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => handleSelectOne(student.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0074bd] focus:ring-[#0074bd]"
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0074bd]">
                      <FaUser className="text-sm" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {student.lastName + " " + student.firstName}
                      </h4>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <PaginationControl
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
              <FaUser className="text-4xl mb-4 opacity-20" />
              <p>Không có dữ liệu học sinh</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralStudentListModal;
