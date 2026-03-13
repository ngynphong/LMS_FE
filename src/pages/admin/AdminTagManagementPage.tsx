import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useAdminTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  useMergeTags,
} from "@/hooks/useCourses";
import PaginationControl from "@/components/common/PaginationControl";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaObjectGroup,
  FaTag,
  FaCheck,
  FaCircleNotch,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Trash2 } from "lucide-react";

const AdminTagManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{ id: number; name: string } | null>(null);
  const [tagName, setTagName] = useState("");

  // Merge state
  const [sourceTagIds, setSourceTagIds] = useState<number[]>([]);
  const [targetTagId, setTargetTagId] = useState<number | null>(null);

  // Debounce search
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Reset page logic when search changes
  useEffect(() => {
    setPageNo(1);
  }, [debouncedSearch]);

  // Hooks
  const { data: tagsData, isLoading, refetch } = useAdminTags({
    pageNo: pageNo - 1,
    pageSize,
    search: debouncedSearch,
  });

  const { mutateAsync: createTag, isPending: creating } = useCreateTag();
  const { mutateAsync: updateTag, isPending: updating } = useUpdateTag();
  const { mutateAsync: deleteTag, isPending: deleting } = useDeleteTag();
  const { mutateAsync: mergeTags, isPending: merging } = useMergeTags();

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      if (selectedTag) {
        await updateTag({ id: selectedTag.id, name: tagName.trim() });
        toast.success("Cập nhật tag thành công");
      } else {
        await createTag(tagName.trim());
        toast.success("Tạo tag mới thành công");
      }
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async () => {
    if (!selectedTag) return;
    try {
      await deleteTag(selectedTag.id);
      toast.success("Xóa tag thành công");
      setIsDeleteModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Không thể xóa tag");
    }
  };

  const handleMerge = async () => {
    if (sourceTagIds.length === 0 || !targetTagId) {
        toast.warning("Vui lòng chọn tag nguồn và tag đích");
        return;
    }
    try {
      await mergeTags({ sourceTagIds, targetTagId });
      toast.success("Gộp tag thành công");
      setIsMergeModalOpen(false);
      setSourceTagIds([]);
      setTargetTagId(null);
      refetch();
    } catch (error) {
      toast.error("Gộp tag thất bại");
    }
  };

  const openEditModal = (tag?: { id: number; name: string }) => {
    if (tag) {
      setSelectedTag(tag);
      setTagName(tag.name);
    } else {
      setSelectedTag(null);
      setTagName("");
    }
    setIsEditModalOpen(true);
  };

  const toggleSourceTag = (id: number) => {
    setSourceTagIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading && !tagsData) {
    return <LoadingOverlay isLoading={true} message="Đang tải danh sách tag..." />;
  }

  const tags = tagsData?.items || [];
  const totalPages = tagsData?.totalPage || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FaTag className="text-blue-600" />
            Quản lý Course Tags
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem, tạo mới và tinh chỉnh các nhãn dán cho khóa học
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsMergeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <FaObjectGroup />
            Gộp Tag
          </button>
          <button
            onClick={() => openEditModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <FaPlus />
            Thêm Tag mới
          </button>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Tổng cộng:{" "}
          <span className="text-blue-600">{tagsData?.totalElement || 0}</span>{" "}
          tags
        </div>
      </div>

      {/* Tags Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tên Tag
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {tag.slug}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(tag)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTag(tag);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-400 text-sm"
                >
                  Không tìm thấy tag nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <PaginationControl
              currentPage={pageNo}
              totalPages={totalPages}
              onPageChange={setPageNo}
              disablePageSizeSelect
            />
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedTag ? "Cập nhật Tag" : "Thêm Tag mới"}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tên Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="VD: Lập trình, Marketing, Soft Skills..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating || updating || !tagName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {(creating || updating) && (
                    <FaCircleNotch className="animate-spin" />
                  )}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa Tag"
        message={`Bạn có chắc chắn muốn xóa tag "${selectedTag?.name}"? Các khóa học đang sử dụng tag này sẽ bị gỡ bỏ tag này.`}
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy"
        variant="danger"
        isLoading={deleting}
      />

      {/* Merge Modal */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <FaObjectGroup className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Gộp Thẻ (Merge Tags)
                </h3>
              </div>
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <IoClose className="text-xl" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-700 flex gap-3">
                <span className="shrink-0 mt-0.5">💡</span>
                <p>
                  Tính năng gộp giúp bạn làm sạch dữ liệu. Tất cả khóa học thuộc
                  về <b>Tags nguồn</b> sẽ được chuyển sang <b>Tag đích</b>, sau
                  đó các Tags nguồn sẽ bị xóa.
                </p>
              </div>

              {/* Step 1: Select Sources */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-tight">
                  Bước 1: Chọn các Tags cần gộp (Nguồn)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleSourceTag(tag.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                        sourceTagIds.includes(tag.id)
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-400"
                      }`}
                    >
                      <span className="truncate">{tag.name}</span>
                      {sourceTagIds.includes(tag.id) && (
                        <FaCheck className="shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Target */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-tight">
                  Bước 2: Chọn Tag đích
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags
                    .filter((t) => !sourceTagIds.includes(t.id))
                    .map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setTargetTagId(tag.id)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                          targetTagId === tag.id
                            ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100"
                            : "bg-white border-slate-200 text-slate-600 hover:border-green-400"
                        }`}
                      >
                        <span className="truncate">{tag.name}</span>
                        {targetTagId === tag.id && (
                          <FaCheck className="shrink-0" />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsMergeModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleMerge}
                disabled={merging || sourceTagIds.length === 0 || !targetTagId}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {merging && <FaCircleNotch className="animate-spin" />}
                Xác nhận gộp{" "}
                {sourceTagIds.length > 0 && `(${sourceTagIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTagManagementPage;
