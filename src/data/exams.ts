import type { Exam } from '../types/exam';

const exams: Exam[] = [
  {
    id: 'E-001',
    title: 'Kiểm tra cuối kỳ Lập trình Web',
    description: 'Bài thi đánh giá kiến thức về HTML, CSS và JavaScript nâng cao.',
    courseName: 'Lập trình Web Fullstack',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    duration: 60,
    maxAttempts: 1,
    passingScore: 50,
    shuffleQuestions: true,
    questionCount: 30,
    status: 'published',
    createdAt: '2024-01-10'
  },
  {
    id: 'E-002',
    title: 'Kiểm tra giữa kỳ UI/UX Design',
    description: 'Đánh giá kiến thức cơ bản về thiết kế giao diện người dùng.',
    courseName: 'Thiết kế UI/UX',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    duration: 45,
    maxAttempts: 2,
    passingScore: 60,
    shuffleQuestions: true,
    questionCount: 20,
    status: 'draft',
    createdAt: '2024-01-12'
  },
  {
    id: 'E-003',
    title: 'Quiz Marketing cơ bản',
    description: 'Bài quiz nhỏ kiểm tra kiến thức Marketing 4P.',
    courseName: 'Digital Marketing',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    duration: 30,
    maxAttempts: 3,
    passingScore: 70,
    shuffleQuestions: false,
    questionCount: 15,
    status: 'closed',
    createdAt: '2024-01-05'
  }
];

export default exams;
