import type { AdminStats, CourseApprovalRequest, AdminUser } from '../types/admin';

export const adminStats: AdminStats = {
  totalUsers: 5200,
  userGrowth: 12,
  activeCourses: 450,
  activeCoursesGrowth: 0,
  revenue: 1200000000, // 1.2 billion VND
  revenueGrowth: 8,
  visits: 15400,
  visitsGrowth: 5,
  lastUpdated: '14:30, 24/05/2024'
};

export const approvalRequests: CourseApprovalRequest[] = [
  {
    id: 'REQ-001',
    courseName: 'Thiết kế UI/UX nâng cao',
    instructorName: 'Nguyễn Văn A',
    submittedDate: '12/10/2023',
    status: 'pending'
  },
  {
    id: 'REQ-002',
    courseName: 'Lập trình ReactJS',
    instructorName: 'Trần Thị B',
    submittedDate: '11/10/2023',
    status: 'pending'
  },
  {
    id: 'REQ-003',
    courseName: 'Marketing Online 101',
    instructorName: 'Lê Văn C',
    submittedDate: '10/10/2023',
    status: 'pending'
  }
];

export const adminUsers: AdminUser[] = [
  {
    id: 'USR-1240',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com',
    role: 'STUDENT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrVJ0NL1ey3-cWtpAkDnB3NTZaRGoBTetUAyyH7Qx3QX-gbRrv7uxu7_sG6cBixSVsEz6mGVI7JuEP17acckc5darEAKXCGwRi1IxeJ80JubI1g-tpD6DNS3XNweaPelmhPTHQ4qD0b6pm6OtJDbmSrkahPVrKlbkbAz92sbBV2HpbmqcU9DGZTb0MDFJa1lu2_doG1X2wuSzWuUFItcQCAAVy16ZpkJWrWZohzcW0d-mPMgDuLMS-EjulUAsvFfkmW1XM4ZBlkOqD',
    joinedDate: '12/10/2023',
    status: 'Active'
  },
  {
    id: 'USR-1241',
    name: 'Lê Thị Mai',
    email: 'mai.le@edulms.com',
    role: 'TEACHER',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqHA5BvlpfdQ2hJCiWfqpP0SVl-LPw-hKt-l-3tAPsrWxJ1YXqKtBKR2kKIYXMj-yGEwGPFkLCXGnmj7gWhBuyw_aMwFhOZyAdggFpqG3eO4iWLHY0vpE6jUXbcmYMEYolWHaNkTJD4yZ3n2tzS4M9KrJO3JSMspYox1PSaJLNSw9C5Enj22VTsMkRxluEAVWYwnyqIOZOPHsq2Qiyn5XzOCSYocGo91w3rWzfovlfKzMzdq5ANJNEnp1d8kctsf1pnw6_XTsc-6-N',
    joinedDate: '05/10/2023',
    status: 'Active'
  },
  {
    id: 'USR-1242',
    name: 'Trần Minh Tuấn',
    email: 'tuan.tm@collab.com',
    role: 'ADMIN',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRXrCWc7wUZItpBX84FBxJ3tYrfQA9Tcxq1C9QY1X8VZ9yxCB-P6XEV-s5myXBgYP2fh6OLvLlUOZCGyQ-aZEBmS73-iXFr7oVzvkowzJXBwVPx9MoR9N4l0zaLJhCJ6Y8zJpOS1o4bpVWlvebmUVcv-R-xxMWOJutWoYkqRMJ_RG-gVuQQLq15mSAmW_fbfU91eZKfhlpvdf3JWOfdI7uQQgg_8T0R0i_7ti0z5c180sMQ9mDqyW3SH4GnbT-brMg8OQLCBfozwrU',
    joinedDate: '01/10/2023',
    status: 'Blocked'
  },
  {
    id: 'USR-1243',
    name: 'Phạm Thu Hà',
    email: 'ha.pham@example.com',
    role: 'STUDENT',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0bgOaBuNV5ic5iXWCuG_vxieBBHL4a8Vhr5L5sh-qRAeFeTleyCctgGuH4j7nQokfSEPz0zdOFVNp_mXvMlAwJPzgHmaRdBDNiN2QJiQLrXIhAMNPyFIYTgpuX_qui2KnCPcCYKCCmN0IKaSihPenKe48onJAgHajbgh6nRHwft1IzI37_2FeBsuFbf_cyj4_VM8APDp8rhtVMLPKi3-2SDAZ8FLLZMEKAN1CyvicBd-FNQKKR__E4ZqnY6KL9fic7RHbCO9ihvTD',
    joinedDate: '28/09/2023',
    status: 'Active'
  },
  {
    id: 'USR-1245',
    name: 'Hoàng Văn Nam',
    email: 'nam.hoang@example.com',
    role: 'STUDENT',
    avatar: '',
    joinedDate: '25/09/2023',
    status: 'Pending'
  }
];
