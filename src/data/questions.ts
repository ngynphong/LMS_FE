import type { Question } from '../types/question';

const questions: Question[] = [
  {
    id: 'Q-00124',
    content: 'Giải thuật sắp xếp nào có độ phức tạp trung bình là O(n log n)?',
    topic: 'Công nghệ thông tin',
    difficulty: 'medium',
    type: 'multiple_choice',
    createdAt: '2023-10-12',
    options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
    correctAnswer: 'Quick Sort'
  },
  {
    id: 'Q-00125',
    content: 'Phân tích ưu nhược điểm của chiến lược Marketing Mix 4P trong kỷ nguyên số.',
    topic: 'Marketing',
    difficulty: 'hard',
    type: 'essay',
    createdAt: '2023-10-11'
  },
  {
    id: 'Q-00126',
    content: 'Khai báo biến trong ngôn ngữ Python cần từ khóa nào?',
    topic: 'Công nghệ thông tin',
    difficulty: 'easy',
    type: 'multiple_choice',
    createdAt: '2023-10-10',
    options: ['var', 'let', 'const', 'Không cần từ khóa'],
    correctAnswer: 'Không cần từ khóa'
  },
  {
    id: 'Q-00127',
    content: 'Trình bày khái niệm về cung và cầu trong kinh tế học vi mô.',
    topic: 'Kinh tế học',
    difficulty: 'medium',
    type: 'essay',
    createdAt: '2023-10-09'
  },
  {
    id: 'Q-00128',
    content: 'SQL là viết tắt của từ gì?',
    topic: 'Công nghệ thông tin',
    difficulty: 'easy',
    type: 'multiple_choice',
    createdAt: '2023-10-08',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
    correctAnswer: 'Structured Query Language'
  },
  {
    id: 'Q-00129',
    content: 'Phân tích mô hình SWOT và ứng dụng trong quản trị chiến lược.',
    topic: 'Quản trị kinh doanh',
    difficulty: 'hard',
    type: 'essay',
    createdAt: '2023-10-07'
  }
];

export const topics = [
  'Công nghệ thông tin',
  'Marketing',
  'Quản trị kinh doanh',
  'Kinh tế học'
];

export default questions;
