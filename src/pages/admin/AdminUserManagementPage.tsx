import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdRestartAlt,
  MdLock,
  MdEdit,
  MdVpnKey,
  MdDelete,
  MdFileDownload,
  MdPersonAdd,
  MdChevronLeft,
  MdChevronRight,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { adminUsers } from "../../data/admin";
import type { UserRole, UserStatus } from "../../types/admin";

const AdminUserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [activeTab, setActiveTab] = useState<"All" | UserRole>("All");

  // Filter logic
  const filteredUsers = adminUsers.filter((user) => {
    // Search
    const searchMatch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Role Filter (Dropdown)
    const roleMatch = roleFilter === "All" || user.role === roleFilter;

    // Status Filter
    const statusMatch = statusFilter === "All" || user.status === statusFilter;

    // Tab Filter
    const tabMatch = activeTab === "All" || user.role === activeTab;

    return searchMatch && roleMatch && statusMatch && tabMatch;
  });

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
        <div className="flex items-center gap-2 text-sm text-[#607b8a] mb-2">
          <Link
            to="/admin/dashboard"
            className="hover:text-[#0078bd] transition-colors"
          >
            Hệ thống
          </Link>
          <span>/</span>
          <span className="text-[#111518] font-medium">Quản lý người dùng</span>
        </div>
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
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
              <MdFileDownload className="text-xl" />
              Xuất báo cáo
            </button>
            <button className="px-5 py-2.5 bg-[#0078bd] text-white font-semibold text-sm rounded-lg flex items-center gap-2 hover:bg-[#0078bd]/90 shadow-lg shadow-[#0078bd]/20 transition-all">
              <MdPersonAdd className="text-xl" />
              Thêm thành viên
            </button>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0078bd]/50 transition-all text-[#111518]"
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
                  setRoleFilter(e.target.value as UserRole | "All")
                }
                className="w-full py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0078bd]/50 text-[#111518] cursor-pointer"
              >
                <option value="All">Tất cả vai trò</option>
                <option value="Student">Học viên</option>
                <option value="Instructor">Giảng viên</option>
                <option value="Collaborator">CTV Nội dung</option>
              </select>
            </div>
            <div className="w-48">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as UserStatus | "All")
                }
                className="w-full py-2.5 bg-[#f5f7f8] border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0078bd]/50 text-[#111518] cursor-pointer"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Active">Đang hoạt động</option>
                <option value="Blocked">Bị khóa</option>
                <option value="Pending">Chờ xác thực</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
                className="px-4 py-2.5 text-slate-500 hover:text-[#0078bd] font-medium text-sm flex items-center gap-1 transition-colors"
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
              onClick={() => setActiveTab("All")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "All"
                  ? "border-[#0078bd] text-[#0078bd]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Tất cả ({adminUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("STUDENT")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "STUDENT"
                  ? "border-[#0078bd] text-[#0078bd]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Học viên ({adminUsers.filter((u) => u.role === "STUDENT").length})
            </button>
            <button
              onClick={() => setActiveTab("TEACHER")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "TEACHER"
                  ? "border-[#0078bd] text-[#0078bd]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Giảng viên (
              {adminUsers.filter((u) => u.role === "TEACHER").length})
            </button>
            <button
              onClick={() => setActiveTab("ADMIN")}
              className={`pb-4 border-b-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === "ADMIN"
                  ? "border-[#0078bd] text-[#0078bd]"
                  : "border-transparent text-[#607b8a] hover:text-[#111518]"
              }`}
            >
              Admin ({adminUsers.filter((u) => u.role === "ADMIN").length})
            </button>
          </div>
          <div className="pb-3">
            <button className="px-4 py-2 bg-red-50 text-red-600 font-semibold text-xs rounded-lg flex items-center gap-2 hover:bg-red-100 transition-all border border-red-100">
              <MdLock className="text-lg" />
              Khóa tài khoản hàng loạt
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#0078bd] focus:ring-[#0078bd]"
                  />
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ID
                </th>
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
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const statusInfo = getStatusBadge(user.status);
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-[#0078bd] focus:ring-[#0078bd]"
                      />
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">
                      #{user.id.split("-")[1]}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <div
                            className="w-9 h-9 rounded-full bg-cover bg-center border border-slate-200"
                            style={{ backgroundImage: `url('${user.avatar}')` }}
                          ></div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#111518]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#607b8a]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role === "STUDENT"
                          ? "Học viên"
                          : user.role === "TEACHER"
                            ? "Giảng viên"
                            : "Admin"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {user.joinedDate}
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
                            checked={user.status === "Active"}
                            readOnly
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0078bd]"></div>
                        </label>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-[#0078bd] hover:bg-[#0078bd]/10 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <MdEdit className="text-xl" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                          title="Đặt lại mật khẩu"
                        >
                          <MdVpnKey className="text-xl" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa người dùng"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
            <p className="text-sm text-[#607b8a]">
              Hiển thị {filteredUsers.length} trên tổng số {adminUsers.length}{" "}
              kết quả
            </p>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-[#0078bd] hover:border-[#0078bd] transition-all">
                <MdChevronLeft className="text-xl" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0078bd] text-white font-bold text-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0078bd] hover:border-[#0078bd] transition-all font-bold text-sm">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0078bd] hover:border-[#0078bd] transition-all font-bold text-sm">
                3
              </button>
              <span className="flex items-center px-1 text-slate-400">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-[#0078bd] hover:border-[#0078bd] transition-all">
                <MdChevronRight className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
