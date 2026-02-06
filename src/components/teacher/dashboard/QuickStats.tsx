import type { DashboardSummaryResponse } from "../../../types/teacherDashboard";

interface QuickStatsProps {
  data: DashboardSummaryResponse | undefined;
  isLoading: boolean;
}

interface StatItem {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

const QuickStats = ({ data, isLoading }: QuickStatsProps) => {
  const statsData: StatItem[] = data
    ? [
        {
          icon: "groups",
          label: "Tổng học viên",
          value: data.totalStudents,
          subtitle: `${data.totalEnrollments} lượt đăng ký`,
          color: "bg-[#0b8eda]",
        },
        {
          icon: "warning",
          label: "Cần chú ý",
          value: data.needingAttentionCount,
          subtitle: "Tiến độ dưới 30%",
          color: "bg-orange-500",
        },
        {
          icon: "school",
          label: "Khóa học",
          value: `${data.publishedCourses}/${data.totalCourses}`,
          subtitle: "Đã xuất bản / Tổng",
          color: "bg-green-500",
        },
        {
          icon: "trending_up",
          label: "Tiến độ TB",
          value: `${data.averageProgress.toFixed(1)}%`,
          subtitle: `${data.completedEnrollments} hoàn thành`,
          color: "bg-purple-500",
        },
        {
          icon: "quiz",
          label: "Quiz",
          value: `${data.publishedQuizzes}/${data.totalQuizzes}`,
          subtitle: `${data.totalQuizAttempts} lượt làm`,
          color: "bg-indigo-500",
        },
        {
          icon: "grade",
          label: "Điểm Quiz TB",
          value: `${data.averageQuizScore.toFixed(1)}`,
          subtitle: `Tỷ lệ đậu: ${data.overallPassRate.toFixed(1)}%`,
          color: "bg-teal-500",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-[#dbe2e6] animate-pulse"
          >
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-3" />
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl border border-[#dbe2e6] flex flex-col gap-2 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <span
              className={`p-2 ${stat.color}/10 rounded-lg text-${stat.color.replace("bg-", "")} material-symbols-outlined`}
              style={{
                backgroundColor: `${stat.color.includes("#") ? stat.color.replace("bg-[", "").replace("]", "") : ""}1a`,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  color: stat.color.includes("#")
                    ? stat.color.replace("bg-[", "").replace("]", "")
                    : undefined,
                }}
              >
                {stat.icon}
              </span>
            </span>
          </div>
          <p className="text-[#607b8a] text-sm font-medium">{stat.label}</p>
          <p className="text-[#111518] text-2xl font-bold">{stat.value}</p>
          {stat.subtitle && (
            <p className="text-[#607b8a] text-xs">{stat.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
