import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  MdAdminPanelSettings,
  MdSchool,
  MdSwapHoriz,
} from "react-icons/md";

/** Label + icon cho mỗi role */
const ROLE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  ADMIN: {
    label: "Quản trị viên",
    icon: <MdAdminPanelSettings className="text-lg" />,
    color: "text-red-600 bg-red-50 border-red-200",
  },
  TEACHER: {
    label: "Giảng viên",
    icon: <MdSchool className="text-lg" />,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
};

interface RoleSwitcherProps {
  /** collapsed state của sidebar */
  isCollapsed?: boolean;
  /** mobile sidebar open state */
  isMobileOpen?: boolean;
}

/**
 * Dropdown chuyển đổi role — chỉ render khi user có ≥2 roles.
 */
const RoleSwitcher = ({
  isCollapsed = false,
  isMobileOpen = false,
}: RoleSwitcherProps) => {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Không render nếu user không có nhiều roles
  if (!user || !user.roles || user.roles.length < 2) return null;

  const currentConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.STUDENT;
  const otherRoles = user.roles.filter((r) => r !== user.role);
  const showLabel = !isCollapsed || isMobileOpen;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 w-full rounded-lg border transition-all cursor-pointer hover:shadow-sm ${currentConfig.color} ${
          isCollapsed && !isMobileOpen ? "justify-center p-2" : "px-3 py-2"
        }`}
        title={isCollapsed ? `Đang dùng: ${currentConfig.label}` : ""}
      >
        <MdSwapHoriz className="text-lg shrink-0" />
        {showLabel && (
          <>
            <span className="text-xs font-bold truncate hidden lg:block">
              {currentConfig.label}
            </span>
            <span className="text-xs font-bold truncate lg:hidden">
              {currentConfig.label}
            </span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-999 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-w-[180px] animate-in fade-in slide-in-from-top-1 duration-150 ${
            isCollapsed && !isMobileOpen ? "left-full ml-2 top-0" : "bottom-full mb-2 left-0 right-0"
          }`}
        >
          <div className="p-2 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              Chuyển vai trò
            </p>
          </div>
          {otherRoles.map((role) => {
            const config = ROLE_CONFIG[role];
            if (!config) return null;
            return (
              <button
                key={role}
                onClick={() => {
                  switchRole(role as "TEACHER" | "ADMIN");
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className={`p-1.5 rounded-lg border ${config.color}`}>
                  {config.icon}
                </span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
