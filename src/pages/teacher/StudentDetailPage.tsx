import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTeacher } from "../../hooks/useTeacher";
import type { UpdateStudentRequest } from "../../types/student";

const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { student, loading, getStudent, updateStudent } = useTeacher();

  // Edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateStudentRequest>({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    goal: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      getStudent(id);
    }
  }, [id, getStudent]);

  // Update edit form when student data loads
  useEffect(() => {
    if (student) {
      setEditForm({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone || "",
        dob: student.dob || "",
        goal: student.goal || "",
      });
    }
  }, [student]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setUpdating(true);
    try {
      await updateStudent(id, editForm);
      // toast is handled in hook, but we need to close modal and refresh
      setIsEditModalOpen(false);
      getStudent(id); // Refresh data
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !student) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading student details...
      </div>
    );
  }

  if (!student && !loading) {
    return (
      <div className="p-8 text-center text-slate-500">Student not found</div>
    );
  }

  // Safety check in case student is null during render (unlikely with above checks)
  if (!student) return null;

  const firstChar = student.firstName
    ? student.firstName[0]
    : "S";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 -mx-8 -mt-8 px-8 py-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/teacher/students"
            className="text-slate-500 text-sm font-medium hover:text-[#0074bd] transition-colors"
          >
            Quản lý học viên
          </Link>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-slate-500 text-sm font-medium">
            Chi tiết học viên
          </span>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-[#101518] text-sm font-bold">
            {student.firstName} {student.lastName}
          </span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {student.urlImg ? (
              <div
                className="size-24 rounded-full bg-cover bg-center border-4 border-slate-50 shrink-0"
                style={{ backgroundImage: `url('${student.urlImg}')` }}
              />
            ) : (
              <div className="size-24 rounded-full bg-[#0074bd]/10 flex items-center justify-center text-[#0074bd] font-bold text-3xl border-4 border-slate-50 shrink-0">
                {firstChar}
              </div>
            )}

            <div className="flex flex-col">
              <h2 className="text-[#101518] text-2xl font-bold leading-tight">
                {student.lastName} {student.firstName}
              </h2>
              <p className="text-slate-500 text-base">{student.email}</p>
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.status === "inactive" ? "bg-slate-100 text-slate-500" : "bg-green-100 text-green-600"}`}
                >
                  {student.status === "inactive" ? "Inactive" : "Active"}
                </span>
                {student.schoolName && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                    {student.schoolName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#0074bd] text-white text-sm font-bold hover:bg-[#0074bd]/90 transition-all shadow-lg shadow-[#0074bd]/25"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* Info Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#0074bd]/10 p-2 rounded-lg text-[#0074bd]">
              <span className="material-symbols-outlined">person</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Thông tin cá nhân
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500">Phone:</span>
              <span className="font-medium">{student.phone || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500">DOB:</span>
              <span className="font-medium">{student.dob || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500">Created At:</span>
              <span className="font-medium">
                {student.createdAt
                  ? new Date(student.createdAt).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Created By:</span>
              <span className="font-medium">
                {student.createdByTeacherName || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#0074bd]/10 p-2 rounded-lg text-[#0074bd]">
              <span className="material-symbols-outlined">flag</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Mục tiêu (Goal)
            </p>
          </div>
          <p className="text-[#101518] text-base mt-2 whitespace-pre-wrap">
            {student.goal || "Chưa có mục tiêu"}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">
                Chỉnh sửa thông tin học viên
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-[#0074bd] focus:border-[#0074bd]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-[#0074bd] focus:border-[#0074bd]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-[#0074bd] focus:border-[#0074bd]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={editForm.dob}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-[#0074bd] focus:border-[#0074bd]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Mục tiêu
                </label>
                <textarea
                  name="goal"
                  value={editForm.goal}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-[#0074bd] focus:border-[#0074bd]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-[#0074bd] text-white font-bold hover:bg-[#0074bd]/90 disabled:opacity-50 flex items-center gap-2"
                >
                  {updating && (
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                  )}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailPage;
