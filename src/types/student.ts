export interface Student {
  id: string;
  name: string;
  email: string;
  urlImg: string;
  status: 'active' | 'inactive';
  enrolledCourses: number;
  completionRate: number;
  lastAccess: string;
  courseName?: string;
} 