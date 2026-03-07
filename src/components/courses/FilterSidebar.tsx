import { useState, useEffect } from "react";
import { IoFilter } from "react-icons/io5";
import { FaUserTie, FaCalendarAlt } from "react-icons/fa";
import { useCourseTeachers } from "@/hooks/useCourses";

interface FilterSidebarProps {
  teacherName: string;
  setTeacherName: (name: string) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  onApply: () => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  teacherName,
  setTeacherName,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onApply,
  onClearFilters,
}) => {
  const [localTeacherName, setLocalTeacherName] = useState(teacherName);
  const [localFromDate, setLocalFromDate] = useState(fromDate);
  const [localToDate, setLocalToDate] = useState(toDate);

  const { data: teachersData } = useCourseTeachers();
  const teachers = teachersData?.data || [];

  // Sync if props change
  useEffect(() => {
    setLocalTeacherName(teacherName);
    setLocalFromDate(fromDate);
    setLocalToDate(toDate);
  }, [teacherName, fromDate, toDate]);

  const handleApply = () => {
    setTeacherName(localTeacherName);
    setFromDate(localFromDate);
    setToDate(localToDate);
    onApply();
  };

  const handleClear = () => {
    setLocalTeacherName("");
    setLocalFromDate("");
    setLocalToDate("");
    setTeacherName("");
    setFromDate("");
    setToDate("");
    onClearFilters();
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-24">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 text-lg font-bold">Bộ lọc</h2>
            <span className="material-symbols-outlined text-gray-500">
              <IoFilter />
            </span>
          </div>

          {/* Teacher Name Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 color-primary">
              <span className="material-symbols-outlined text-[20px]">
                <FaUserTie />
              </span>
              <p className="text-sm font-bold">Giảng viên</p>
            </div>
            <select
              id="teacherName"
              value={localTeacherName}
              onChange={(e) => setLocalTeacherName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E90FF] focus:border-[#1E90FF] bg-white"
            >
              <option value="">Tất cả giảng viên</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.fullName}>
                  {teacher.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 color-primary">
              <span className="material-symbols-outlined text-[20px]">
                <FaCalendarAlt />
              </span>
              <p className="text-sm font-bold">Ngày tạo</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="fromDate" className="text-xs text-gray-500 font-medium">
                  Từ ngày:
                </label>
                <input
                  type="date"
                  id="fromDate"
                  value={localFromDate}
                  onChange={(e) => setLocalFromDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="toDate" className="text-xs text-gray-500 font-medium">
                  Đến ngày:
                </label>
                <input
                  type="date"
                  id="toDate"
                  value={localToDate}
                  onChange={(e) => setLocalToDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E90FF] focus:border-[#1E90FF]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center rounded-lg h-11 color-primary-bg text-white text-sm font-bold shadow-md hover:color-primary/90 transition-all"
            >
              <span>Áp dụng</span>
            </button>
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center rounded-lg h-11 bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-all"
            >
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
