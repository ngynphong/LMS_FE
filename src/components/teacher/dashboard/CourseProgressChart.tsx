interface CourseProgress {
  code: string;
  progress: number;
}

const coursesProgress: CourseProgress[] = [
  { code: 'KH01', progress: 60 },
  { code: 'KH02', progress: 50 },
  { code: 'KH03', progress: 40 },
  { code: 'KH04', progress: 90 },
  { code: 'KH05', progress: 78 }
];

const CourseProgressChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#dbe2e6]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[#111518] text-lg font-bold">
          Tiến độ học tập của các khóa học
        </h2>
        <span className="text-[#0b8eda] text-sm font-medium flex items-center gap-1 cursor-pointer hover:underline">
          Chi tiết
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between h-48 px-4 gap-6">
          {coursesProgress.map((course) => (
            <div key={course.code} className="w-full flex flex-col items-center gap-2">
              <div className="w-full bg-[#0b8eda]/10 rounded-t-lg relative group h-full">
                <div
                  className="absolute bottom-0 w-full bg-[#0b8eda] rounded-t-lg transition-all duration-500"
                  style={{ height: `${course.progress}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111518] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {course.progress}%
                </div>
              </div>
              <span className="text-[#607b8a] text-xs font-bold uppercase">{course.code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressChart;
