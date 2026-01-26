import type { ExamReport } from '../types/report';

const examReports: ExamReport[] = [
  {
    id: 'R-001',
    examId: 'E-001',
    examTitle: 'Kiểm tra cuối khóa - Lập trình Web',
    courseName: 'Lập trình Web Fullstack',
    lastUpdated: 'Hôm nay lúc 09:45',
    totalParticipants: 120,
    averageScore: 7.8,
    passRate: 85,
    incompleteCount: 15,
    gradeDistribution: {
      excellent: 45,
      good: 30,
      average: 10,
      poor: 15
    },
    questionPerformance: [
      { questionId: 'Q1', correctRate: 80 },
      { questionId: 'Q2', correctRate: 35 },
      { questionId: 'Q3', correctRate: 95 },
      { questionId: 'Q4', correctRate: 60 },
      { questionId: 'Q5', correctRate: 85 },
      { questionId: 'Q6', correctRate: 70 },
      { questionId: 'Q7', correctRate: 50 },
      { questionId: 'Q8', correctRate: 80 }
    ],
    results: [
      {
        id: 'RS-001',
        studentName: 'Nguyễn Thành Trung',
        studentInitials: 'NT',
        studentColor: 'bg-primary/10 text-primary',
        submittedAt: '10/10/2023 14:30',
        attempts: 1,
        score: 9.5,
        status: 'passed'
      },
      {
        id: 'RS-002',
        studentName: 'Lê Hoàng Nam',
        studentInitials: 'LH',
        studentColor: 'bg-orange-100 text-orange-600',
        submittedAt: '10/10/2023 15:15',
        attempts: 2,
        score: 7.2,
        status: 'passed'
      },
      {
        id: 'RS-003',
        studentName: 'Minh Anh Trần',
        studentInitials: 'MA',
        studentColor: 'bg-purple-100 text-purple-600',
        submittedAt: '10/10/2023 16:00',
        attempts: 1,
        score: 4.8,
        status: 'failed'
      },
      {
        id: 'RS-004',
        studentName: 'Phạm Văn Đồng',
        studentInitials: 'PV',
        studentColor: 'bg-blue-100 text-blue-600',
        submittedAt: '10/10/2023 16:45',
        attempts: 1,
        score: 8.0,
        status: 'passed'
      },
      {
        id: 'RS-005',
        studentName: 'Quang Dũng Vũ',
        studentInitials: 'QD',
        studentColor: 'bg-gray-100 text-gray-600',
        submittedAt: 'Chưa hoàn thành',
        attempts: 0,
        score: null,
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'R-002',
    examId: 'E-002',
    examTitle: 'Kiểm tra giữa kỳ UI/UX Design',
    courseName: 'Thiết kế UI/UX',
    lastUpdated: 'Hôm qua lúc 15:30',
    totalParticipants: 85,
    averageScore: 7.2,
    passRate: 78,
    incompleteCount: 8,
    gradeDistribution: {
      excellent: 35,
      good: 33,
      average: 10,
      poor: 22
    },
    questionPerformance: [
      { questionId: 'Q1', correctRate: 75 },
      { questionId: 'Q2', correctRate: 60 },
      { questionId: 'Q3', correctRate: 82 },
      { questionId: 'Q4', correctRate: 45 },
      { questionId: 'Q5', correctRate: 90 }
    ],
    results: []
  },
  {
    id: 'R-003',
    examId: 'E-003',
    examTitle: 'Quiz Marketing cơ bản',
    courseName: 'Digital Marketing',
    lastUpdated: '3 ngày trước',
    totalParticipants: 65,
    averageScore: 8.1,
    passRate: 92,
    incompleteCount: 3,
    gradeDistribution: {
      excellent: 55,
      good: 28,
      average: 9,
      poor: 8
    },
    questionPerformance: [
      { questionId: 'Q1', correctRate: 92 },
      { questionId: 'Q2', correctRate: 85 },
      { questionId: 'Q3', correctRate: 78 }
    ],
    results: []
  }
];

export default examReports;
