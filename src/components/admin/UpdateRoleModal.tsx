import { useState, useEffect } from "react";
import { MdClose, MdSecurity } from "react-icons/md";

interface UpdateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (roles: string[]) => void;
  currentRoles: string[];
  isLoading?: boolean;
}

const AVAILABLE_ROLES = [
  { value: "STUDENT", label: "Học viên" },
  { value: "TEACHER", label: "Giảng viên" },
  { value: "ADMIN", label: "Quản trị viên (Admin)" },
];

export const UpdateRoleModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentRoles,
  isLoading = false,
}: UpdateRoleModalProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Calculate default roles or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRoles([...currentRoles]);
    }
  }, [isOpen, currentRoles]);

  const handleToggleRole = (role: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSubmit = () => {
    onConfirm(selectedRoles);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all scale-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MdSecurity className="text-[#0078bd] text-xl" />
            <h3 className="text-lg font-bold text-gray-900">
              Cập nhật vai trò
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Chọn các vai trò cho người dùng này. Người dùng sẽ có quyền truy cập
            tương ứng với các vai trò được chọn.
          </p>
          <div className="space-y-3">
            {AVAILABLE_ROLES.map((role) => (
              <label
                key={role.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRoles.includes(role.value)
                    ? "border-[#0078bd] bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#0078bd] focus:ring-[#0078bd]"
                  checked={selectedRoles.includes(role.value)}
                  onChange={() => handleToggleRole(role.value)}
                />
                <span
                  className={`ml-3 text-sm font-medium ${
                    selectedRoles.includes(role.value)
                      ? "text-[#0078bd]"
                      : "text-gray-700"
                  }`}
                >
                  {role.label}
                </span>
              </label>
            ))}
          </div>
          {selectedRoles.length === 0 && (
            <p className="text-xs text-red-500 mt-2">
              * Vui lòng chọn ít nhất một vai trò.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedRoles.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0078bd] hover:bg-[#006da8] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
