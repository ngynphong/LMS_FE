import React, { useState } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { useAdminBlogs, useAdminBlogMutations } from "../../../hooks/useBlogs";
import { Link } from "react-router-dom";
import PaginationControl from "../../../components/common/PaginationControl";

const AdminBlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useAdminBlogs(currentPage, pageSize);
  const { deleteBlog } = useAdminBlogMutations();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      deleteBlog(id);
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý bài viết
          </h1>
          <p className="text-slate-500 mt-1">
            Tổng cộng {response?.data.totalElement || 0} bài viết trong hệ thống
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <Link
            to="/admin/blogs/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200 font-semibold"
          >
            <Plus size={18} />
            <span>Tạo mới</span>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-5">Thông tin bài viết</th>
                <th className="p-5">Tags</th>
                <th className="p-5">Slug</th>
                <th className="p-5 font-medium">Ngày tạo</th>
                <th className="p-5 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-5">
                      <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-4 bg-slate-100 rounded w-24"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-8 bg-slate-100 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : response?.data.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={40} className="text-slate-200" />
                      <p>Không tìm thấy bài viết nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                response?.data.items.map((post) => (
                  <tr
                    key={post.id}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {post.title}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                          {post.summary}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      {post.tags?.length === 0 ? (
                        <span className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                          Không có tag
                        </span>
                      ) : (
                        post.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-100 bg-blue-50 text-blue-700"
                          >
                            {tag}
                          </span>
                        ))
                      )}
                    </td>
                    <td className="p-5">
                      <span className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                        {post.slug}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-sm font-medium">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/blogs/edit/${post.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa bài viết"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      {!isLoading && response && response.data.totalPage > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <PaginationControl
            currentPage={currentPage}
            totalPages={response.data.totalPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminBlogPage;
