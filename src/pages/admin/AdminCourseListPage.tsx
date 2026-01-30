import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAdminCourses,
  useBanCourse,
  useApproveCourse,
} from "../../hooks/useCourses";
import type { ApiCourse } from "../../types/learningTypes";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { ConfirmationModal } from "../../components/common/ConfirmationModal";

const AdminCourseListPage = () => {
  // State
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "APPROVE" | "BAN" | null;
    courseId: string | null;
    title: string;
    message: string;
    variant: "info" | "danger";
  }>({
    isOpen: false,
    type: null,
    courseId: null,
    title: "",
    message: "",
    variant: "info",
  });

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Main Data Hook
  const { data, loading, refetch } = useAdminCourses({
    pageNo: page,
    pageSize: 10,
    keyword: debouncedKeyword,
    status: statusFilter,
    sorts: ["createdAt:desc"],
  });

  // Stats Hooks (Independent of filters)
  const { data: allCoursesData } = useAdminCourses({ pageSize: 1 });
  const { data: pendingCoursesData } = useAdminCourses({
    status: "PUBLISHED",
    pageSize: 1,
  });
  const { data: bannedCoursesData } = useAdminCourses({
    status: "BANNED",
    pageSize: 1,
  });

  const { ban, loading: banLoading } = useBanCourse();
  const { approve, loading: approveLoading } = useApproveCourse();

  const openBanModal = (id: string, courseName: string) => {
    setModalConfig({
      isOpen: true,
      type: "BAN",
      courseId: id,
      title: "Khóa/Từ chối khóa học",
      message: `Bạn có chắc chắn muốn khóa/từ chối khóa học "${courseName}"? Hành động này sẽ ẩn khóa học khỏi hệ thống.`,
      variant: "danger",
    });
  };

  const handleConfirmAction = async () => {
    if (!modalConfig.courseId || !modalConfig.type) return;

    try {
      if (modalConfig.type === "APPROVE") {
        await approve(modalConfig.courseId, "PUBLISHED");
        toast.success("Đã phê duyệt khóa học thành công");
      } else if (modalConfig.type === "BAN") {
        await ban(modalConfig.courseId);
        toast.success("Đã khóa khóa học thành công");
      }
      refetch();
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error(
        modalConfig.type === "APPROVE"
          ? "Phê duyệt thất bại"
          : "Khóa khóa học thất bại",
      );
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center justify-center text-center px-2 py-1 rounded-xl text-xs font-bold bg-green-100 text-green-600">
            <span className="size-1.5"></span>
            Hoạt động
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center justify-center text-center px-2 py-1 rounded-xl text-xs font-bold bg-orange-100 text-orange-600">
            <span className="size-1.5"></span>
            Bản nháp
          </span>
        );
      case "BANNED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center justify-center text-center px-2 py-1 rounded-xl text-xs font-bold bg-red-100 text-red-600">
            <span className="size-1.5"></span>
            Đã khóa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-600">
            <span className="size-1.5"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-8">
      <LoadingOverlay
        isLoading={banLoading || approveLoading}
        message="Đang xử lý..."
      />

      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black tracking-tight">
            Quản lý danh sách khóa học
          </h2>
          <p className="text-gray-500 text-base">
            Theo dõi, phê duyệt và quản lý nội dung các khóa học trên hệ thống.
          </p>
        </div>
      </div>

      {/* Stats Grid (Static Mock as per template) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Tổng khóa học
            </p>
            <span className="material-symbols-outlined text-primary">
              menu_book
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">
              {allCoursesData?.data.totalElement || 0}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Đang Hoạt động
            </p>
            <span className="material-symbols-outlined text-green-500">
              check
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">
              {pendingCoursesData?.data.totalElement || 0}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Bị báo cáo / Khóa
            </p>
            <span className="material-symbols-outlined text-red-500">
              report
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">
              {bannedCoursesData?.data.totalElement || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition-all"
                placeholder="Tìm kiếm theo tên khóa học..."
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          {/* Dropdowns */}
          <div className="flex gap-3 overflow-x-auto">
            <select
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 text-sm font-medium border-transparent hover:border-gray-200 transition-all cursor-pointer focus:ring-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đang hoạt động</option>
              <option value="PENDING">Chờ phê duyệt</option>
              <option value="BANNED">Đã bị khóa</option>
            </select>
          </div>
          {/* Chips Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${statusFilter === "PENDING" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              Chờ duyệt
            </button>
            <button
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${statusFilter === "PUBLISHED" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              Hoạt động
            </button>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">
                progress_activity
              </span>
              <span className="text-gray-500">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Khóa học
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Giảng viên
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {data?.data.items.map((course: ApiCourse) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-10 rounded bg-cover bg-center bg-gray-100 shrink-0"
                          style={{
                            backgroundImage: `url('${course.thumbnailUrl || "https://placehold.co/100x60?text=No+Image"}')`,
                          }}
                        />
                        <span
                          className="text-sm font-semibold text-gray-700 line-clamp-1 max-w-[200px]"
                          title={course.name}
                        >
                          {course.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 font-medium">
                          {course.teacherName ||
                            course.teacher?.lastName +
                              " " +
                              course.teacher?.firstName ||
                            "N/A"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {course.teacher?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {course.createdAt
                        ? format(new Date(course.createdAt), "dd/MM/yyyy", {
                            locale: vi,
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/courses/${course.id}`}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:-translate-y-1 transition-all size-8 flex items-center justify-center cursor-pointer duration-300"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined">
                            visibility
                          </span>
                        </Link>
                        {course.status !== "BANNED" && (
                          <button
                            onClick={() => openBanModal(course.id, course.name)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:-translate-y-1 transition-all size-8 flex items-center justify-center cursor-pointer duration-300"
                            title="Khóa/Từ chối"
                          >
                            <span className="material-symbols-outlined">
                              block
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.data.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      Không tìm thấy khóa học nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.data.totalPage > 1 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500">
              Hiển thị{" "}
              <span className="font-bold text-navy-dark dark:text-white">
                {page * 10 + 1} -{" "}
                {Math.min((page + 1) * 10, data.data.totalElement)}
              </span>{" "}
              trong{" "}
              <span className="font-bold text-navy-dark dark:text-white">
                {data.data.totalElement}
              </span>{" "}
              khóa học
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="size-8 flex items-center justify-center rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              {Array.from(
                { length: Math.min(5, data.data.totalPage) },
                (_, i) => {
                  let pageNum = page;
                  if (data.data.totalPage <= 5) pageNum = i;
                  else if (page < 2) pageNum = i;
                  else if (page > data.data.totalPage - 3)
                    pageNum = data.data.totalPage - 5 + i;
                  else pageNum = page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`size-8 flex items-center justify-center rounded text-xs font-bold transition-all ${
                        page === pageNum
                          ? "bg-primary text-white"
                          : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                },
              )}
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.data.totalPage - 1, p + 1))
                }
                disabled={page === data.data.totalPage - 1}
                className="size-8 flex items-center justify-center rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        isLoading={banLoading || approveLoading}
        confirmLabel={modalConfig.type === "APPROVE" ? "Phê duyệt" : "Khóa"}
      />
    </div>
  );
};

export default AdminCourseListPage;
