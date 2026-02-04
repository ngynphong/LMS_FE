import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTeacher } from "../../hooks/useTeacher";
import { toast } from "../../components/common/Toast";
import PaginationControl from "../../components/common/PaginationControl";

const StudentListPage = () => {
  // Use useTeacher hook
  const {
    students,
    loading,
    totalPages,
    totalElements,
    getStudents,
    importStudent,
  } = useTeacher();

  // Local state for UI
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");

  // Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch students using hook
  useEffect(() => {
    getStudents(page, pageSize, debouncedKeyword, sortBy, order);
  }, [getStudents, page, pageSize, debouncedKeyword, sortBy, order]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setImporting(true);
    try {
      const response = await importStudent(importFile);
      if (response.code === 0 || response.code === 1000) {
        toast.success(`Nhập thành công: ${response.data.success} học sinh.`);
        if (response.data.failed > 0) {
          toast.warning(
            `Lỗi khi nhập ${response.data.failed} dòng. Hãy kiểm tra lỗi`,
          );
        }
        setIsImportModalOpen(false);
        setImportFile(null);
        getStudents(page, 10, debouncedKeyword); // Refresh list
      } else {
        toast.error(response.message || "Nhập thất bại");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "HV";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#101518] text-2xl font-bold tracking-tight">
            Quản lý học viên
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi tiến độ và hoạt động của học viên
          </p>
        </div>
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg color-primary-bg text-white text-sm font-bold shadow-sm hover:bg-[#0074bd]/90 transition-all w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-lg">upload_file</span>
          Nhập học sinh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
          >
            <option value="name">Tên</option>
            <option value="email">Email</option>
            <option value="totalCourses">Tổng khóa học</option>
          </select>
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#0074bd] focus:border-[#0074bd]"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-[#0074bd]">
              group
            </span>
            <span className="text-xs font-medium">
              Tổng học viên (Hiện tại)
            </span>
          </div>
          <p className="text-[#101518] text-2xl font-bold mt-1">
            {totalElements}
          </p>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            {/* Added min-w-[800px] to ensure table doesn't squash on mobile */}
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Họ và Tên
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Ngày sinh
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Mục tiêu
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Tổng khoá học
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.urlImg ? (
                          <div
                            className="size-10 rounded-full bg-cover bg-center shrink-0 border border-slate-200"
                            style={{
                              backgroundImage: `url('${student.urlImg}')`,
                            }}
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-[#0074bd]/10 flex items-center justify-center text-[#0074bd] font-bold text-xs shrink-0">
                            {getInitials(
                              `${student.lastName} ${student.firstName}`,
                            )}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[#101518] text-sm font-bold truncate">
                            {student.lastName} {student.firstName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{student.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {student.fullName || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{student.dob}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {student.goal || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {student.totalCourses}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/teacher/students/${student.id}`}
                        className="inline-flex items-center gap-1 text-[#0074bd] text-sm font-semibold hover:underline"
                      >
                        Chi tiết
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Chưa có dữ liệu học viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 border-t border-slate-100 py-4 flex-wrap gap-4">
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Import Student</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Chọn file Excel/CSV
                </label>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleImportFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0074bd]/10 file:text-[#0074bd] hover:file:bg-[#0074bd]/20"
                />
                <p className="text-xs text-slate-500">
                  Chấp nhận file .xlsx, .xls, .csv
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!importFile || importing}
                  className="px-4 py-2 rounded-lg bg-[#0074bd] text-white font-bold hover:bg-[#0074bd]/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {importing && (
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                  )}
                  Tải lên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListPage;
