import type { AtRiskStudentResponse } from "../../../types/teacherDashboard";

interface AtRiskStudentsTableProps {
  data: AtRiskStudentResponse[] | undefined;
  isLoading: boolean;
}

const AtRiskStudentsTable = ({ data, isLoading }: AtRiskStudentsTableProps) => {
  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Vừa xong";
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getScoreColor = (score: number) => {
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const students = data || [];

  if (students.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
        <h2 className="text-[#111518] text-lg font-bold mb-6">
          Học viên cần chú ý
        </h2>
        <div className="flex items-center justify-center h-32 text-[#607b8a]">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-2">
              check_circle
            </span>
            <p>Tất cả học viên đang có tiến độ tốt!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#111518] text-lg font-bold">
            Học viên cần chú ý
          </h2>
          <p className="text-sm text-[#607b8a]">
            Học viên có tiến độ thấp hoặc điểm quiz thấp
          </p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
          {students.length} học viên
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[#607b8a] text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 font-bold">Học viên</th>
              <th className="pb-4 font-bold">Điểm thấp nhất</th>
              <th className="pb-4 font-bold">Hoạt động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr
                key={student.studentId}
                className="group hover:bg-gray-50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#111518]">
                      {student.fullName}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(student.lowestQuizScore)}`}
                  >
                    {student.lowestQuizScore.toFixed(1)} điểm
                  </span>
                </td>
                <td className="py-4 text-sm text-[#607b8a]">
                  {formatLastActive(student.lastActive)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtRiskStudentsTable;
