import type { StudentCourse } from '../types/studentCourse';

export const studentCourses: StudentCourse[] = [
  {
    id: 'SC-001',
    title: 'Lập trình Web Fullstack chuyên nghiệp',
    category: 'Công nghệ',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    progress: 75,
    lastAccessed: '2023-10-25',
    status: 'in_progress'
  },
  {
    id: 'SC-002',
    title: 'Thiết kế UI/UX nâng cao',
    category: 'Thiết kế',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    progress: 20,
    lastAccessed: '2023-10-20',
    status: 'in_progress'
  },
  {
    id: 'SC-003',
    title: 'Data Science cơ bản',
    category: 'Dữ liệu',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    progress: 5,
    lastAccessed: '2023-10-15',
    status: 'in_progress'
  },
  {
    id: 'SC-004',
    title: 'Digital Marketing Masterclass',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    progress: 100,
    lastAccessed: '2023-09-30',
    status: 'completed'
  },
  {
    id: 'SC-005',
    title: 'Quản trị kinh doanh cho Startup',
    category: 'Kinh doanh',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    progress: 0,
    lastAccessed: '2023-10-26',
    status: 'favorite'
  }
];
