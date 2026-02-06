import { useAuth } from "../../hooks/useAuth";
import QuickStats from "../../components/teacher/dashboard/QuickStats";
import CourseProgressChart from "../../components/teacher/dashboard/CourseProgressChart";
import QuizPerformanceSection from "../../components/teacher/dashboard/QuizPerformanceSection";
import AtRiskStudentsTable from "../../components/teacher/dashboard/NewStudentsTable";
import {
  useTeacherDashboardSummary,
  useAtRiskStudents,
  useQuizPerformance,
  useCourseHealth,
} from "../../hooks/useTeacher";

const TeacherDashboardPage = () => {
  const { user } = useAuth();

  // Dashboard data hooks
  const { data: summaryData, isLoading: summaryLoading } =
    useTeacherDashboardSummary();
  const { data: atRiskData, isLoading: atRiskLoading } = useAtRiskStudents();
  const { data: quizData, isLoading: quizLoading } = useQuizPerformance();
  const { data: courseData, isLoading: courseLoading } = useCourseHealth();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Chào buổi sáng";
    } else if (hour >= 12 && hour < 18) {
      return "Chào buổi chiều";
    } else if (hour >= 18 && hour < 22) {
      return "Chào buổi tối";
    } else {
      return "Chào đêm khuya";
    }
  };

  const teacherName =
    user?.firstName && user?.lastName
      ? `${user.lastName} ${user.firstName}`
      : "Giảng viên";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[#111518] text-3xl font-bold tracking-tight">
          {getGreeting()}, {teacherName}!
        </h1>
        <p className="text-[#607b8a]">
          Đây là những gì đang diễn ra với các khóa học của bạn hôm nay.
        </p>
      </div>

      {/* Quick Stats Row */}
      <QuickStats data={summaryData?.data} isLoading={summaryLoading} />

      <div className="lg:col-span-3">
        <CourseProgressChart
          data={courseData?.data}
          isLoading={courseLoading}
        />
      </div>
      <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance (40%) */}
        <QuizPerformanceSection
          data={quizData?.data}
          isLoading={quizLoading}
        />

        {/* Bottom Section: At-Risk Students */}
        <AtRiskStudentsTable
          data={atRiskData?.data}
          isLoading={atRiskLoading}
        />
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
