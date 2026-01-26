export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  enrolledCourses: number;
  completionRate: number;
  lastAccess: string;
  courseName?: string;
}