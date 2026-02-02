// Mock data for Course Learning feature
// This file will be removed when API is fully integrated

import type { ApiCourse, LessonQuiz } from '../types/learningTypes';

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
