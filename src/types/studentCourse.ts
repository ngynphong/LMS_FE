export interface StudentCourse {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  progress: number; // 0-100
  lastAccessed: string;
  status: 'in_progress' | 'completed' | 'favorite';
}
