import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useStudents,
  useImportStudents,
  useDownloadImportTemplate,
  useCancelImportJob,
} from "@/hooks/useTeacher";
import PaginationControl from "@/components/common/PaginationControl";
import { FaCircleNotch, FaFileUpload } from "react-icons/fa";
import { getInitials } from "@/utils/initialsName";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { useMyCreatedStudents } from "@/hooks/useStudentReferral";
import { useMemo } from "react";
import ReferralSelectionModal from "@/components/teacher/students/ReferralSelectionModal";
import { IoClose, IoInformation, IoSearch } from "react-icons/io5";
import { MdCancel, MdDownload, MdGroups, MdShare } from "react-icons/md";

const StudentListPage = () => {
  // Local state for UI
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");

  // Referral & Tabs State
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sorts, setSorts] = useState<string>("createdAt:desc");
  // Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralMode, setReferralMode] = useState<"REFERRAL" | "DIRECT_ADD">(
    "REFERRAL",
  );
  const [importFile, setImportFile] = useState<File | null>(null);
  const [lastImportJobId, setLastImportJobId] = useState<string | null>(null);

  // React Query hooks
  const {
    data: studentsData,
    isLoading: loading,
    isFetching: fetching,
  } = useStudents(page, pageSize, debouncedKeyword, sortBy, order);

  const { mutateAsync: importStudent, isPending: importing } =
    useImportStudents();
  const { mutateAsync: downloadTemplate, isPending: downloadingTemplate } =
    useDownloadImportTemplate();
  const { mutateAsync: cancelImport, isPending: cancelling } =
    useCancelImportJob();

  const {
    data: myStudentsData,
    isLoading: myLoading,
    isFetching: myFetching,
  } = useMyCreatedStudents({
    pageNo: page - 1,
    pageSize,
    keyword: debouncedKeyword,
    fromDate,
    toDate,
    sorts: [sorts],
  });

  const students = useMemo(() => {
    if (activeTab === "all") return studentsData?.students || [];
    return (
      myStudentsData?.data?.items?.map((item) => ({
        id: item.id,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        fullName: `${item.lastName} ${item.firstName}`,
        urlImg: item.imgUrl,
        dob: item.dob,
        totalCourses: (item as any).totalCourses || 0,
        goal: item.studentProfile?.goal,
      })) || []
    );
  }, [activeTab, studentsData, myStudentsData]);

  const totalPages =
    activeTab === "all"
      ? studentsData?.totalPages || 1
      : myStudentsData?.data?.totalPage || 1;

  const totalElements =
    activeTab === "all"
      ? studentsData?.totalElements || 0
      : myStudentsData?.data?.totalElement || 0;

  const isLoading = activeTab === "all" ? loading : myLoading;
  const isFetching = activeTab === "all" ? fetching : myFetching;

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

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

    try {
      const responseData = await importStudent(importFile);
      setIsImportModalOpen(false);
      setImportFile(null);

      // Extract jobId from response: "Import job submitted successfully with job : {jobId}"
      const jobIdMatch = responseData?.match(/job\s*:\s*([\w-]+)/);
      if (jobIdMatch?.[1]) {
        setLastImportJobId(jobIdMatch[1]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelImport = async () => {
    if (!lastImportJobId) return;
    try {
      await cancelImport(lastImportJobId);
      setLastImportJobId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {importing && (
        <LoadingOverlay
          isLoading={importing}
          message="Đang nhập danh sách học sinh..."
        />
      )}

      {/* Cancel Import Banner */}
      {lastImportJobId && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <span className="text-lg">
              <IoInformation />
            </span>
            <span>Đã gửi lệnh import. Kiểm tra thông báo để xem kết quả.</span>
          </div>
          <button
            onClick={handleCancelImport}
            disabled={cancelling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition-colors shrink-0"
          >
            {cancelling ? (
              <FaCircleNotch className="animate-spin text-xs" />
            ) : (
              <span className="text-sm">
                <MdCancel />
              </span>
            )}
            Huỷ import
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#101518] text-2xl font-bold tracking-tight">
            Quản lý học sinh
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi tiến độ và hoạt động của học sinh
          </p>
        </div>
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg color-primary-bg text-white text-sm font-bold shadow-sm hover:bg-[#0074bd]/90 transition-all w-full sm:w-auto"
        >
          <span className="text-lg">
            <FaFileUpload />
          </span>
          Nhập học sinh
        </button>
      </div>

      {/* Referral Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("all");
            setPage(1);
            setSelectedIds([]);
          }}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${
            activeTab === "all"
              ? "color-primary"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Tất cả học sinh
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 color-primary-bg" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("mine");
            setPage(1);
            setSelectedIds([]);
          }}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${
            activeTab === "mine"
              ? "color-primary"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Học sinh tôi tạo
          {activeTab === "mine" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 color-primary-bg" />
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IoSearch />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
          />
        </div>

        {activeTab === "mine" && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
              />
            </div>
            <select
              value={sorts}
              onChange={(e) => {
                setSorts(e.target.value);
                setPage(1);
              }}
              className="w-1/2 px-2 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
            >
              <option value="createdAt:asc">Tăng dần</option>
              <option value="createdAt:desc">Giảm dần</option>
            </select>
          </>
        )}
        {activeTab === "all" && (
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
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
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-[#1E90FF] focus:border-[#1E90FF]"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[#1E90FF]">
              <MdGroups />
            </span>
            <span className="text-xs font-medium">
              Tổng học sinh (Hiện tại)
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
                {activeTab === "mine" && (
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        students.length > 0 &&
                        selectedIds.length === students.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(students.map((s: any) => s.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-[#0b8eda] focus:ring-[#0b8eda]"
                    />
                  </th>
                )}
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Học sinh
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
                  Tổng khoá học
                </th>
                <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-slate-100 transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(student.id) ? "bg-blue-50" : ""}`}
                  >
                    {activeTab === "mine" && (
                      <td className="px-6 py-4">
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
                          className="w-4 h-4 rounded border-slate-300 text-[#0b8eda] focus:ring-[#0b8eda]"
                        />
                      </td>
                    )}
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
                        {student.totalCourses}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/teacher/students/${student.id}`}
                        className="inline-flex items-center hover:underline gap-1 text-[#0074bd] text-sm font-semibold cursor-pointer"
                      >
                        Chi tiết
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
                    Chưa có dữ liệu học sinh
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
            pageSizeOptions={[10, 20, 50, 100, 1000]}
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
                <span className="text-lg">
                  <IoClose />
                </span>
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
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E90FF]/10 file:text-[#1E90FF] hover:file:bg-[#1E90FF]/20"
                />
                <p className="text-xs text-slate-500">
                  Chấp nhận file .xlsx, .xls, .csv
                </p>
                <button
                  type="button"
                  onClick={() => downloadTemplate()}
                  disabled={downloadingTemplate}
                  className="inline-flex items-center gap-1.5 text-sm font-medium color-primary cursor-pointer disabled:opacity-50 mt-1"
                >
                  <span className="text-base">
                    <MdDownload />
                  </span>
                  {downloadingTemplate ? "Đang tải..." : "Tải template mẫu"}
                </button>
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
                  className="px-4 py-2 rounded-lg bg-[#1E90FF] text-white font-bold hover:bg-[#1E90FF]/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {importing && (
                    <span className="animate-spin text-sm">
                      <FaCircleNotch />
                    </span>
                  )}
                  Tải lên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referral Selection Modal */}
      <ReferralSelectionModal
        isOpen={isReferralModalOpen}
        onClose={() => {
          setIsReferralModalOpen(false);
          setSelectedIds([]);
        }}
        selectedStudentIds={selectedIds}
        mode={referralMode}
      />

      {/* Floating Action Toolbar */}
      {activeTab === "mine" && selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#101518] text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-6 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
              <div className="size-8 bg-[#0074bd] rounded-full flex items-center justify-center font-bold text-sm">
                {selectedIds.length}
              </div>
              <span className="text-sm font-medium text-slate-300 whitespace-nowrap">
                Học sinh đang chọn
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Hủy chọn
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReferralMode("REFERRAL");
                    setIsReferralModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 color-primary-bg hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <span className="text-[20px]">
                    <MdShare />
                  </span>
                  Gửi yêu cầu giới thiệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListPage;
