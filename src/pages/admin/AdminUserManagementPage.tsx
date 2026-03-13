import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdRestartAlt,
  MdEdit,
  MdVpnKey,
  MdDelete,
  MdPersonAdd,
  MdCheckCircle,
  MdCancel,
  MdClose,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import PaginationControl from "@/components/common/PaginationControl";
import type { UserRole, UserStatus } from "@/types/admin";
import { useUsers } from "@/hooks/useUsers";
import type { AdminUserListItem } from "@/types/user";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { UpdateRoleModal } from "@/components/admin/UpdateRoleModal";
import { useResetUserPassword } from "@/hooks/useAdmin";
import Breadcrumb from "@/components/common/Breadcrumb";

const AdminUserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState<
    "All" | "true" | "false"
  >("All");
  const [isLockedFilter, setIsLockedFilter] = useState<
    "All" | "true" | "false"
  >("All");
  const [activeTab, setActiveTab] = useState<"All" | UserRole>("All");

  const handleIsVerifiedChange = (val: "All" | "true" | "false") => {
    setIsVerifiedFilter(val);
    const isVerified = val === "All" ? undefined : val === "true";
    updateParams({ isVerified, pageNo: 0 });
  };

  const handleIsLockedChange = (val: "All" | "true" | "false") => {
    setIsLockedFilter(val);
    const isLocked = val === "All" ? undefined : val === "true";
    updateParams({ isLocked, pageNo: 0 });
  };
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update Role Modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState<string | null>(null);
  const [currentRolesToUpdate, setCurrentRolesToUpdate] = useState<string[]>(
    [],
  );
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Reset Password Modal state
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const resetPasswordMutation = useResetUserPassword();

  const { data, loading, updateParams, deleteUser, updateUserRoles } = useUsers(
    {
      pageNo: 0,
      pageSize: 10,
      keyword: "",
      role: "All",
      sorts: ["desc"],
    },
  );

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await deleteUser(userToDelete);
      // toast.success("Xóa người dùng thành công");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user", error);
      // toast.error("Xóa người dùng thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateRole = (userId: string, currentRoles: string[]) => {
    setUserToUpdateRole(userId);
    setCurrentRolesToUpdate(currentRoles);
    setIsRoleModalOpen(true);
  };

  const confirmUpdateRole = async (newRoles: string[]) => {
    if (!userToUpdateRole) return;

    try {
      setIsUpdatingRole(true);
      await updateUserRoles(userToUpdateRole, { roles: newRoles });
      // toast.success("Cập nhật vai trò thành công");
      setIsRoleModalOpen(false);
      setUserToUpdateRole(null);
    } catch (error) {
      console.error("Failed to update role", error);
      // toast.error("Cập nhật vai trò thất bại");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Reset Password handlers
  const handleResetPassword = (userId: string, userName: string) => {
    setUserToResetPassword({ id: userId, name: userName });
    setNewPassword("");
    setShowPassword(false);
    setIsResetPasswordModalOpen(true);
  };

  const confirmResetPassword = () => {
    if (!userToResetPassword || newPassword.length < 6) return;
    resetPasswordMutation.mutate(
      { userId: userToResetPassword.id, data: { newPassword } },
      {
        onSuccess: () => {
          setIsResetPasswordModalOpen(false);
          setUserToResetPassword(null);
          setNewPassword("");
        },
      },
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounce can be added here
    updateParams({ keyword: e.target.value, pageNo: 0 });
  };

  const handleRoleChange = (role: UserRole | "All") => {
    setRoleFilter(role);
    // Sync tab if role matches
    if (
      role === "All" ||
      role === "STUDENT" ||
      role === "TEACHER" ||
      role === "ADMIN"
    ) {
      setActiveTab(role as "All" | UserRole);
    }
    updateParams({ role: role, pageNo: 0 });
  };

  // Tab change handler
  const handleTabChange = (tab: "All" | UserRole) => {
    setActiveTab(tab);
    setRoleFilter(tab);
    updateParams({ role: tab, pageNo: 0 });
  };

  // PaginationControl dùng 1-indexed, API dùng 0-indexed
  const handlePageChange = (page: number) => {
    updateParams({ pageNo: page - 1 });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    updateParams({ pageSize: size, pageNo: 0 });
  };

  const filteredUsers = data?.items || [];
  const totalElements = data?.totalElement || 0;
  const totalPages = data?.totalPage || 0;
  const currentPage = data?.pageNo || 0;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "STUDENT":
        return "bg-blue-50 text-blue-600";
      case "TEACHER":
        return "bg-purple-50 text-purple-600";
      case "ADMIN":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "Active":
        return {
          color: "bg-green-100 text-green-700",
          label: "Hoạt động",
          icon: <MdCheckCircle />,
        };
      case "Blocked":
        return {
          color: "bg-red-100 text-red-700",
          label: "Bị khóa",
          icon: <MdCancel />,
        };
      case "Pending":
        return {
          color: "bg-gray-100 text-gray-700",
          label: "Chờ xác thực",
          icon: <MdFilterList />,
        }; // Using a placeholder icon
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          label: status,
          icon: null,
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Breadcrumbs */}
      <div className="pb-6">
        <Breadcrumb
          items={[
            { label: "Hệ thống", url: "/admin/dashboard" },
            { label: "Quản lý người dùng" },
          ]}
          className="flex items-center gap-2 mb-2"
          itemClassName="text-sm text-[#607b8a] font-medium hover:text-[#0078bd] transition-colors"
          activeItemClassName="text-sm text-[#111518] font-medium"
          separator={<span className="text-[#607b8a] text-sm">/</span>}
        />
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[#111518] text-4xl font-black tracking-tight mb-2">
              Quản lý người dùng
            </h2>
            <p className="text-[#607b8a] text-base leading-relaxed">
              Quản lý toàn diện hồ sơ học viên, giảng viên và cộng tác viên.
              Kiểm soát trạng thái truy cập và bảo mật tài khoản.
            </p>
          </div>
          <div className="flex gap-3 pb-2">
            <Link
              to="/admin/teachers/new"
              className="px-5 py-2.5 bg-[#0078bd] text-white font-semibold text-sm rounded-lg flex items-center gap-2 hover:bg-[#0078bd]/90 shadow-lg shadow-[#0078bd]/20 transition-all"
            >
              <MdPersonAdd className="text-xl" />
              Thêm giáo viên
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filter Section */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <MdSearch className="text-xl" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all text-[#111518]"
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                />
              </div>
            </div>
            <div className="w-48">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Vai trò
              </label>
              <select
                value={roleFilter}
                onChange={(e) =>
                  handleRoleChange(e.target.value as UserRole | "All")
                }
                className="w-full py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all text-[#111518] cursor-pointer"
              >
                <option value="All">Tất cả vai trò</option>
                <option value="STUDENT">Học viên</option>
                <option value="TEACHER">Giảng viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
            <div className="w-36">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Xác thực
              </label>
              <select
                value={isVerifiedFilter}
                onChange={(e) =>
                  handleIsVerifiedChange(
                    e.target.value as "All" | "true" | "false",
                  )
                }
                className="w-full py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all text-[#111518] cursor-pointer"
              >
                <option value="All">Tất cả</option>
                <option value="true">Đã xác thực</option>
                <option value="false">Chưa xác thực</option>
              </select>
            </div>
            <div className="w-40">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Trạng thái khóa
              </label>
              <select
                value={isLockedFilter}
                onChange={(e) =>
                  handleIsLockedChange(
                    e.target.value as "All" | "true" | "false",
                  )
                }
                className="w-full py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#1E90FF] outline-none transition-all text-[#111518] cursor-pointer"
              >
                <option value="All">Tất cả</option>
                <option value="false">Đang hoạt động</option>
                <option value="true">Bị khóa</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("All");
                  setIsVerifiedFilter("All");
                  setIsLockedFilter("All");
                  updateParams({
                    keyword: "",
                    role: "All",
                    isVerified: undefined,
                    isLocked: undefined,
                    pageNo: 0,
                  });
                }}
                className="px-4 py-2.5 text-slate-500 hover:text-[#1E90FF] font-medium text-sm flex items-center gap-1 transition-colors cursor-pointer"
              >
                <MdRestartAlt className="text-xl" />
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action & Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => handleTabChange("All")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "All"
                  ? "border-[#1E90FF] text-[#1E90FF]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Tất cả{activeTab === "All" ? ` (${totalElements})` : ""}
            </button>
            <button
              onClick={() => handleTabChange("STUDENT")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "STUDENT"
                  ? "border-[#1E90FF] text-[#1E90FF]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Học viên ({data?.totalStudents || 0})
            </button>
            <button
              onClick={() => handleTabChange("TEACHER")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "TEACHER"
                  ? "border-[#1E90FF] text-[#1E90FF]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Giảng viên ({data?.totalTeachers || 0})
            </button>
            <button
              onClick={() => handleTabChange("ADMIN")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "ADMIN"
                  ? "border-[#1E90FF] text-[#1E90FF]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Admin ({data?.totalAdmins || 0})
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-slate-100 transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {!filteredUsers.length && loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: AdminUserListItem) => {
                  const displayStatus: UserStatus = user.studentProfile?.deleted
                    ? "Blocked"
                    : "Active";
                  const statusInfo = getStatusBadge(displayStatus);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.imgUrl ? (
                            <div
                              className="w-9 h-9 rounded-full bg-cover bg-center border border-slate-200"
                              style={{
                                backgroundImage: `url('${user.imgUrl}')`,
                              }}
                            ></div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                              {user.firstName?.charAt(0) ||
                                user.email.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-[#111518]">
                              {user.lastName} {user.firstName}
                            </p>
                            <p className="text-xs text-[#607b8a]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getRoleBadgeColor(user.roles[0] as UserRole)}`}
                        >
                          {user.roles.includes("STUDENT")
                            ? "Học viên"
                            : user.roles.includes("TEACHER")
                              ? "Giảng viên"
                              : user.roles.includes("ADMIN")
                                ? "Admin"
                                : user.roles.join(", ")}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(
                          user.studentProfile?.createdAt || Date.now(),
                        ).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!user.studentProfile?.deleted}
                              readOnly
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0078bd]"></div>
                          </label>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.roles.includes("STUDENT") && (
                            <Link
                              to={`/admin/users/student/${user.id}`}
                              className="p-2 text-slate-400 hover:text-[#0078bd] hover:bg-[#0078bd]/10 rounded-lg transition-all"
                              title="Xem chi tiết học viên"
                            >
                              <MdVisibility className="text-xl" />
                            </Link>
                          )}
                          <button
                            onClick={() =>
                              handleUpdateRole(user.id, user.roles)
                            }
                            className="p-2 text-slate-400 hover:text-[#0078bd] hover:bg-[#0078bd]/10 rounded-lg transition-all cursor-pointer"
                            title="Chỉnh sửa vai trò"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() =>
                              handleResetPassword(
                                user.id,
                                `${user.firstName} ${user.lastName}`,
                              )
                            }
                            className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all cursor-pointer"
                            title="Đặt lại mật khẩu"
                          >
                            <MdVpnKey className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Xóa người dùng"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-slate-500 italic"
                  >
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <PaginationControl
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50, 100, 1000]}
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={isDeleting}
        variant="danger"
      />

      <UpdateRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onConfirm={confirmUpdateRole}
        currentRoles={currentRolesToUpdate}
        isLoading={isUpdatingRole}
      />

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#111518]">
                  Đặt lại mật khẩu
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {userToResetPassword?.name}
                </p>
              </div>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    className="w-full px-4 py-2.5 pr-10 bg-[#f5f7f8] border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0078bd] focus:border-transparent outline-none transition-all text-[#111518]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="text-lg" />
                    ) : (
                      <MdVisibility className="text-lg" />
                    )}
                  </button>
                </div>
                {newPassword.length > 0 && newPassword.length < 6 && (
                  <p className="text-xs text-red-500 mt-1">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
              >
                Hủy
              </button>
              <button
                onClick={confirmResetPassword}
                disabled={
                  newPassword.length < 6 || resetPasswordMutation.isPending
                }
                className="px-5 py-2 text-sm font-semibold text-white bg-[#0078bd] hover:bg-[#0078bd]/90 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
