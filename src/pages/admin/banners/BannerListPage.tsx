import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  MoreVertical,
  ShieldAlert,
} from "lucide-react";
import { bannerService } from "../../../services/bannerService";
import type { Banner } from "../../../types/banner";
import { toast } from "@/components/common/Toast";
import { ConfirmationModal } from "../../../components/common/ConfirmationModal";

export const BannerListPage: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "adminBanners",
      { keyword: debouncedKeyword, page: 1, size: 10 },
    ],
    queryFn: () =>
      bannerService.getAllBanners({
        keyword: debouncedKeyword,
        page: 1,
        size: 10,
      }),
  });

  const handleDeleteClick = (id: string) => {
    setBannerIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const processDelete = async () => {
    if (!bannerIdToDelete) return;

    setIsDeleting(true);
    try {
      await bannerService.deleteBanner(bannerIdToDelete);
      toast.success("Xóa banner thành công!");
      refetch();
      setDeleteModalOpen(false);
      setBannerIdToDelete(null);
    } catch (error) {
      toast.error("Xóa thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const banners = data?.data?.items || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý các chiến dịch quảng cáo, thông báo
          </p>
        </div>
        <Link
          to="/admin/banners/create"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Mới
        </Link>
      </div>

      {/* Toolbar Segment */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96 shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 justify-center w-full sm:w-auto">
            <Filter size={16} /> Bộ lọc
          </button>
        </div>
      </div>

      {/* Table Segment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Banner</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 hidden md:table-cell">Vị trí chèn</th>
                <th className="px-6 py-4 hidden lg:table-cell">Hiệu suất</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                // Loading Skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-12 w-48 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-8 bg-gray-200 rounded-full ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : banners.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <ShieldAlert
                      size={48}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-600">
                      Chưa có banner nào
                    </p>
                    <p className="text-sm mt-1">
                      Hệ thống chưa ghi nhận dữ liệu banner phù hợp với tìm
                      kiếm.
                    </p>
                  </td>
                </tr>
              ) : (
                banners.map((banner: Banner) => (
                  <tr
                    key={banner.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-12 w-20 rounded bg-gray-100 border border-gray-200 bg-cover bg-center shrink-0"
                          style={{ backgroundImage: `url(${banner.imageUrl})` }}
                        />
                        <div>
                          <p
                            className="font-medium text-gray-900 max-w-xs truncate"
                            title={banner.title}
                          >
                            {banner.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              banner.startTime || "",
                            ).toLocaleDateString() || "Không giới hạn"}{" "}
                            -{" "}
                            {new Date(
                              banner.endTime || "",
                            ).toLocaleDateString() || "Không giới hạn"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${banner.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {banner.active ? "Đang bật" : "Đã tắt"}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                        {banner.bannerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-xs text-gray-600">
                        <p>
                          <span className="font-medium text-gray-900">
                            {banner.impressions}
                          </span>{" "}
                          xem
                        </p>
                        <p>
                          <span className="font-medium text-blue-600">
                            {banner.clicks}
                          </span>{" "}
                          click (
                          {banner.impressions > 0
                            ? (
                                (banner.clicks / banner.impressions) *
                                100
                              ).toFixed(1)
                            : 0}
                          %)
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/banners/edit/${banner.id}`)
                          }
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(banner.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            Hiển thị 1-10 trong số {data?.data?.totalElement || 0} kết quả
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">
              Trước
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:opacity-50">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBannerIdToDelete(null);
        }}
        onConfirm={processDelete}
        title="Xóa Banner"
        message="Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác và banner sẽ bị gỡ khỏi toàn bộ hệ thống ngay lập tức."
        confirmLabel="Xóa Banner"
        cancelLabel="Hủy"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
