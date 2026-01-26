import QuickStats from '../../components/teacher/dashboard/QuickStats';
import CourseProgressChart from '../../components/teacher/dashboard/CourseProgressChart';
import TaskList from '../../components/teacher/dashboard/TaskList';
import NewStudentsTable from '../../components/teacher/dashboard/NewStudentsTable';

const TeacherDashboardPage = () => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Chào buổi sáng';
    } else if (hour >= 12 && hour < 18) {
      return 'Chào buổi chiều';
    } else if (hour >= 18 && hour < 22) {
      return 'Chào buổi tối';
    } else {
      return 'Chào đêm khuya';
    }
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[#111518] text-3xl font-bold tracking-tight">
          {getGreeting()}, Giảng viên Nguyễn Văn B!
        </h1>
        <p className="text-[#607b8a]">
          Đây là những gì đang diễn ra với các khóa học của bạn hôm nay.
        </p>
      </div>

      {/* Quick Stats Row */}
      <QuickStats />

      {/* Middle Section (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Progress Chart (60%) */}
        <div className="lg:col-span-3">
          <CourseProgressChart />
        </div>

        {/* Task List (40%) */}
        <div className="lg:col-span-2">
          <TaskList />
        </div>
      </div>

      {/* Bottom Section: New Students List */}
      <NewStudentsTable />
    </div>
  );
};

export default TeacherDashboardPage;
