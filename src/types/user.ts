import type { TeacherProfileData } from "./teacherProfile";
import type { ProfileStats } from "./auth";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  urlImg?: string;
  dob?: string;
  roles: string[];
  active: boolean;
  teacherProfile?: TeacherProfileData;
  studentProfile?: StudentProfile;
}

export interface StudentProfile {
  id: string;
  schoolName: string;
  emergencyContact: string;
  goal: string;
  stats?: ProfileStats;
}

export interface UpdateStudentProfileRequest {
  schoolName: string;
  emergencyContact: string;
  goal: string;
}

export interface UpdateStudentProfileResponse {
  code: number;
  message: string;
  data: StudentProfile;
}

export interface UserPaginationData {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  sortBy: string[];
  items: User[];
}

export interface UserResponse {
  code: number;
  message: string;
  data: UserPaginationData;
}


export interface UserQueryParams {
  pageNo?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserDashboardParams {
  keyword?: string;
  role?: string;
  isVerified?: boolean;
  isLocked?: boolean;
  pageNo?: number;
  pageSize?: number;
  sorts?: string[];
}

export interface UserDashboardResponse {
  code: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElement: number;
    sortBy: string[];
    items: User[];
  };
}

// Types for GET /users/teachers API
export interface TeacherListTeacherProfile {
  id: string;
  qualification: string;
  specialization: string;
  experience: string;
  biography: string;
  rating: number;
  certificateUrls: string[];
  isVerified: boolean;
}

export interface TeacherListStudentProfile {
  id: string;
  schoolName: string;
  emergencyContact: string;
}

export interface TeacherListParentProfile {
  id: string;
  occupation: string;
}

export interface TeacherListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imgUrl: string;
  dob: string;
  roles: string[];
  teacherProfile: TeacherListTeacherProfile;
  studentProfile?: TeacherListStudentProfile;
  parentProfile?: TeacherListParentProfile;
}

export interface TeacherListPaginationData {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  sortBy: string[];
  items: TeacherListItem[];
}

export interface TeacherListResponse {
  code: number;
  message: string;
  data: TeacherListPaginationData;
}

export interface TeacherListQueryParams {
  pageNo?: number;
  pageSize?: number;
  sorts?: string[];
}
// Types for GET /users (Admin)
export interface AdminUserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imgUrl: string;
  dob: string;
  roles: string[];
  teacherProfile?: {
    id: string;
    qualification: string;
    specialization: string;
    experience: string;
    biography: string;
    certificateUrls: string[];
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
  };
  studentProfile?: {
    id: string;
    schoolName: string;
    goal: string;
    emergencyContact: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    stats: ProfileStats;
  };
}

export interface AdminUserPaginationData {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  sortBy: string[];
  items: AdminUserListItem[];
}

export interface AdminUserListResponse {
  code: number;
  message: string;
  data: AdminUserPaginationData;
}

export interface UpdateUserRoleRequest {
  roles: string[];
}

