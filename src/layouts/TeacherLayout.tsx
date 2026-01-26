import type { ReactNode } from 'react';
import TeacherSidebar from '../components/teacher/TeacherSidebar';

interface TeacherLayoutProps {
  children: ReactNode;
}

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f5f7f8] flex">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-y-auto">
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
