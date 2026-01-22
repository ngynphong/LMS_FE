import type { ReactNode } from 'react';
import StudentSidebar from '../components/student/StudentSidebar';

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f6f7f8] flex">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-10 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
