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

export interface AdminDashboardData {
  data: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    activeCourses: number;
    currentOnlineUsers: number;
    totalPageViews: number;
    todayVisitors: number;
  };
}


export interface SystemLog {
  id: string;
  action: string;
  actor: string;
  ipAddress: string;
  endpoint: string;
  method: string;
  requestData: string;
  timestamp: string;
  success: boolean;
}

export interface SystemLogResponse {
  code: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElement: number;
    sortBy: string[];
    items: SystemLog[];
  };
}

export interface CreateTeacherRequest {
  email: string;
  password?: string; // Optional if generated or same as email
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  roleName: string; // Should be "TEACHER"
}

export interface TeacherProfile {
  id: string;
  qualification: string;
  specialization: string;
  experience: string;
  biography: string;
  certificateUrls: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imgUrl: string;
  dob: string;
  roles: string[];
}

export interface CreateTeacherResponseData extends UserData {
  teacherProfile: TeacherProfile;
  studentProfile: { id: string };
}

export interface CreateTeacherResponse {
  code: number;
  message: string;
  data: CreateTeacherResponseData;
}
