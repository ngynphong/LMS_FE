import type { Student } from "../types/student";

export const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Văn A',
    lastName: 'Nguyễn',
    email: 'nguyenvana@email.com',
    urlImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    enrolledCourses: 3,
    completionRate: 75,
    lastAccess: 'Hôm nay, 10:24',
    courseName: 'Digital Marketing Pro'
  },
  {
    id: '2',
    firstName: 'Thị Ngọc',
    lastName: 'Trần',
    email: 'tranthingoc@email.com',
    urlImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    enrolledCourses: 2,
    completionRate: 90,
    lastAccess: 'Hôm qua, 15:30',
    courseName: 'UI/UX Design Master'
  },
  {
    id: '3',
    firstName: 'Văn Hùng',
    lastName: 'Lê',
    email: 'levanhung@email.com',
    urlImg: '',
    status: 'active',
    enrolledCourses: 4,
    completionRate: 45,
    lastAccess: '2 ngày trước',
    courseName: 'Digital Marketing Pro'
  },
  {
    id: '4',
    firstName: 'Minh Anh',
    lastName: 'Phạm',
    email: 'phamminhanh@email.com',
    urlImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'inactive',
    enrolledCourses: 1,
    completionRate: 25,
    lastAccess: '12 thg 05, 2024',
    courseName: 'Kỹ năng Giao tiếp'
  },
  {
    id: '5',
    firstName: 'Thanh Tùng',
    lastName: 'Quách',
    email: 'quachthanhtung@email.com',
    urlImg: '',
    status: 'active',
    enrolledCourses: 2,
    completionRate: 60,
    lastAccess: 'Hôm nay, 08:15',
    courseName: 'UI/UX Design Master'
  },
  {
    id: '6',
    firstName: 'Thị Mai',
    lastName: 'Hoàng',
    email: 'hoangthimai@email.com',
    urlImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    enrolledCourses: 3,
    completionRate: 85,
    lastAccess: 'Hôm qua, 20:00',
    courseName: 'Digital Marketing Pro'
  }
];
