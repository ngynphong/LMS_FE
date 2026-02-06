import type { CourseHealthResponse } from "../../../types/teacherDashboard";

interface CourseProgressChartProps {
  data: CourseHealthResponse[] | undefined;
  isLoading: boolean;
}

const CourseProgressChart = ({ data, isLoading }: CourseProgressChartProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
        <div className="h-6 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
        <div className="flex items-end justify-between h-48 px-4 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2">
              <div className="w-full bg-gray-200 rounded-t-lg h-full animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const courses = data?.slice(0, 6) || [];

  if (courses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
        <h2 className="text-[#111518] text-lg font-bold mb-8">
          Sức khỏe các khóa học
        </h2>
        <div className="flex items-center justify-center h-48 text-[#607b8a]">
          Chưa có dữ liệu khóa học
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[#111518] text-lg font-bold">
          Sức khỏe các khóa học
        </h2>
        <span className="text-[#0b8eda] text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline">
          Chi tiết
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between h-48 px-4 gap-4">
          {courses.map((course) => {
            // Ensure minimum height of 5% for visibility when progress is very low
            const barHeight = Math.max(course.averageProgress, 5);

            return (
              <div
                key={course.courseId}
                className="flex-1 flex flex-col items-center gap-2 h-full"
              >
                <div className="w-full bg-[#0b8eda]/10 rounded-t-lg relative group flex-1">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#0b8eda] rounded-t-lg transition-all duration-500"
                    style={{ height: `${barHeight}%` }}
                  />
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#111518] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-semibold">
                      {course.averageProgress.toFixed(1)}%
                    </div>
                    <div className="text-gray-300">
                      Quiz: {course.averageQuizScore.toFixed(1)}
                    </div>
                    <div className="text-gray-300">
                      {course.enrolledCount} học viên
                    </div>
                  </div>
                </div>
                <span
                  className="text-[#607b8a] text-[10px] font-bold uppercase text-center truncate w-full"
                  title={course.courseName}
                >
                  {course.courseName.length > 12
                    ? course.courseName.slice(0, 12) + "..."
                    : course.courseName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressChart;
