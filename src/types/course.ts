export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  price: string;
  category: string;
  image: string;
  thumbnail: string;
  studentCount: number;
  lessonCount: number;
  status: 'published' | 'draft';
  revenue: string;
  // Optional fields for student variant
  duration?: string;
  reviews?: number;
}


