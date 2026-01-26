export interface AdminStats {
  totalUsers: number;
  userGrowth: number; // percentage
  activeCourses: number;
  activeCoursesGrowth: number; // percentage
  revenue: number;
  revenueGrowth: number; // percentage
  visits: number;
  visitsGrowth: number; // percentage
  lastUpdated: string;
}

export interface CourseApprovalRequest {
  id: string;
  courseName: string;
  instructorName: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'Active' | 'Blocked' | 'Pending';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedDate: string;
  status: UserStatus;
}
