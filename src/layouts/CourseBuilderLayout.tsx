import type { ReactNode } from 'react';
import TeacherSidebar from '../components/teacher/TeacherSidebar';

interface CourseBuilderLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const CourseBuilderLayout = ({ children, sidebar }: CourseBuilderLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f5f7f8] flex">
      {/* Left Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <div className={`flex-1 ml-64 ${sidebar ? 'mr-80' : ''} overflow-y-auto min-h-screen`}>
        <main className="p-8 max-w-[840px] mx-auto">
          {children}
        </main>
      </div>

      {/* Right Contextual Sidebar */}
      {sidebar}
    </div>
  );
};

export default CourseBuilderLayout;
