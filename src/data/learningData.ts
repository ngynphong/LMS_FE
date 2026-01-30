// Mock data for Course Learning feature
// This file will be removed when API is fully integrated

import type { ApiCourse, ApiLesson, LessonQuiz } from '../types/learningTypes';

// ==================== Mock Courses ====================

export const mockCourses: ApiCourse[] = [
  {
    id: 'SC-001',
    name: 'Lập trình Web Fullstack',
    description: 'Khóa học này được thiết kế để đưa bạn từ một người mới bắt đầu trở thành một nhà phát triển Fullstack. Bạn sẽ học cách xây dựng các ứng dụng web hiện đại từ giao diện người dùng đến hệ thống máy chủ.',
    published: true,
    active: true,
    schoolId: 'school-001',
    teacherId: 'teacher-001',
    teacherName: 'Nguyễn Văn A',
    lessonCount: 12,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    progress: 40
  },
  {
    id: 'SC-002',
    name: 'Thiết kế UI/UX nâng cao',
    description: 'Học cách thiết kế giao diện người dùng đẹp và trải nghiệm người dùng tốt.',
    published: true,
    active: true,
    schoolId: 'school-001',
    teacherId: 'teacher-002',
    teacherName: 'Trần Thị B',
    lessonCount: 8,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    progress: 20
  }
];

// ==================== Mock Lessons ====================

export const mockLessons: ApiLesson[] = [
  // Course SC-001 lessons
  {
    id: 'lesson-001',
    title: 'Giới thiệu HTML',
    orderIndex: 1,
    courseId: 'SC-001',
    duration: '05:20',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    description: 'Trong bài học này, bạn sẽ học các khái niệm cơ bản về HTML, cấu trúc trang web và các thẻ HTML phổ biến.',
    tags: ['HTML', 'Web Basics'],
    isCompleted: true,
    isLocked: false,
    attachments: [
      { id: 'att-001', name: 'HTML_Cheatsheet.pdf', type: 'pdf', url: '#' }
    ]
  },
  {
    id: 'lesson-002',
    title: 'Căn bản CSS',
    orderIndex: 2,
    courseId: 'SC-001',
    duration: '12:45',
    videoUrl: '',
    description: 'Học cách sử dụng CSS để tạo kiểu cho trang web của bạn.',
    tags: ['CSS', 'Styling'],
    isCompleted: true,
    isLocked: false,
    attachments: []
  },
  {
    id: 'lesson-003',
    title: 'Flexbox nâng cao',
    orderIndex: 3,
    courseId: 'SC-001',
    duration: '15:10',
    videoUrl: '',
    description: 'Làm chủ CSS Flexbox để tạo layout linh hoạt.',
    tags: ['CSS', 'Flexbox', 'Layout'],
    isCompleted: true,
    isLocked: false,
    attachments: []
  },
  {
    id: 'lesson-004',
    title: 'Grid Layout',
    orderIndex: 4,
    courseId: 'SC-001',
    duration: '10:30',
    videoUrl: '',
    description: 'Sử dụng CSS Grid để tạo layout phức tạp.',
    tags: ['CSS', 'Grid', 'Layout'],
    isCompleted: true,
    isLocked: false,
    attachments: []
  },
  {
    id: 'lesson-005',
    title: 'Xây dựng giao diện responsive',
    orderIndex: 5,
    courseId: 'SC-001',
    duration: '08:45',
    videoUrl: '',
    description: 'Trong bài học này, chúng ta sẽ học cách sử dụng Media Queries và Flexbox/Grid để tạo ra các giao diện có thể thích ứng với mọi kích thước màn hình từ điện thoại di động đến máy tính để bàn.',
    tags: ['Responsive Design', 'Media Queries', 'Mobile First'],
    isCompleted: false,
    isLocked: false,
    attachments: [
      { id: 'att-002', name: 'UI_Design_Guide.pdf', type: 'pdf', url: '#' },
      { id: 'att-003', name: 'Responsive_Code_Starter.zip', type: 'code', url: '#' }
    ]
  },
  {
    id: 'lesson-006',
    title: 'JavaScript cơ bản',
    orderIndex: 6,
    courseId: 'SC-001',
    duration: '20:00',
    videoUrl: '',
    description: 'Học JavaScript từ căn bản.',
    tags: ['JavaScript', 'Programming'],
    isCompleted: false,
    isLocked: true,
    attachments: []
  },
  {
    id: 'lesson-007',
    title: 'DOM Manipulation',
    orderIndex: 7,
    courseId: 'SC-001',
    duration: '18:15',
    videoUrl: '',
    description: 'Học cách thao tác với DOM bằng JavaScript.',
    tags: ['JavaScript', 'DOM'],
    isCompleted: false,
    isLocked: true,
    attachments: []
  }
];

// ==================== Mock Quizzes ====================

export const mockQuizzes: LessonQuiz[] = [
  {
    id: 'quiz-001',
    lessonId: 'lesson-001',
    title: 'Kiểm tra kiến thức HTML',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'HTML là viết tắt của gì?',
        options: [
          { id: 'a', text: 'Hyper Text Markup Language' },
          { id: 'b', text: 'High Tech Modern Language' },
          { id: 'c', text: 'Home Tool Markup Language' },
          { id: 'd', text: 'Hyperlinks and Text Markup Language' }
        ],
        correctOptionId: 'a',
        explanation: 'HTML là viết tắt của Hyper Text Markup Language.'
      },
      {
        id: 'q2',
        question: 'Thẻ nào dùng để tạo đoạn văn bản?',
        options: [
          { id: 'a', text: '<paragraph>' },
          { id: 'b', text: '<p>' },
          { id: 'c', text: '<text>' },
          { id: 'd', text: '<t>' }
        ],
        correctOptionId: 'b',
        explanation: 'Thẻ <p> được sử dụng để tạo đoạn văn bản.'
      },
      {
        id: 'q3',
        question: 'Thuộc tính nào dùng để thêm liên kết?',
        options: [
          { id: 'a', text: 'link' },
          { id: 'b', text: 'src' },
          { id: 'c', text: 'href' },
          { id: 'd', text: 'url' }
        ],
        correctOptionId: 'c',
        explanation: 'Thuộc tính href được sử dụng để thêm liên kết.'
      }
    ]
  },
  {
    id: 'quiz-005',
    lessonId: 'lesson-005',
    title: 'Kiểm tra Responsive Design',
    passingScore: 70,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'Media Query nào dùng cho màn hình có chiều rộng tối đa 768px?',
        options: [
          { id: 'a', text: '@media (min-width: 768px)' },
          { id: 'b', text: '@media (max-width: 768px)' },
          { id: 'c', text: '@media screen 768px' },
          { id: 'd', text: '@media only 768px' }
        ],
        correctOptionId: 'b',
        explanation: '@media (max-width: 768px) áp dụng cho màn hình có chiều rộng tối đa 768px.'
      },
      {
        id: 'q2',
        question: 'Mobile First nghĩa là gì?',
        options: [
          { id: 'a', text: 'Thiết kế cho desktop trước' },
          { id: 'b', text: 'Thiết kế cho mobile trước, sau đó mở rộng cho desktop' },
          { id: 'c', text: 'Chỉ thiết kế cho mobile' },
          { id: 'd', text: 'Mobile và desktop riêng biệt' }
        ],
        correctOptionId: 'b',
        explanation: 'Mobile First là phương pháp bắt đầu thiết kế từ màn hình nhỏ trước.'
      },
      {
        id: 'q3',
        question: 'Đơn vị nào phù hợp nhất cho thiết kế responsive?',
        options: [
          { id: 'a', text: 'px' },
          { id: 'b', text: 'cm' },
          { id: 'c', text: 'rem hoặc %' },
          { id: 'd', text: 'pt' }
        ],
        correctOptionId: 'c',
        explanation: 'rem và % là đơn vị tương đối, phù hợp cho thiết kế responsive.'
      },
      {
        id: 'q4',
        question: 'Viewport meta tag quan trọng vì:',
        options: [
          { id: 'a', text: 'Giúp trang load nhanh hơn' },
          { id: 'b', text: 'Điều khiển cách trang hiển thị trên mobile' },
          { id: 'c', text: 'Thêm animation cho trang' },
          { id: 'd', text: 'Tối ưu SEO' }
        ],
        correctOptionId: 'b',
        explanation: 'Viewport meta tag giúp điều khiển cách trang hiển thị trên thiết bị di động.'
      }
    ]
  }
];
