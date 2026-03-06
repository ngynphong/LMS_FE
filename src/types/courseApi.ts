export interface CourseItem {
    id: string;
    name: string;
    thumbnailUrl: string;
    description: string;
    status: string; // e.g., "DRAFT", "PUBLISHED", etc.
    visibility: string; // e.g., "PUBLIC", "PRIVATE"
    teacherName: string;
    schoolName: string;
    lessonCount: number;
    updatedAt: string;
    createdAt: string;
}

export interface TopEnrolledCoursesResponse {
    code: number;
    message: string;
    data: CourseItem[];
}

export interface CourseListResponse {
    code: number;
    message: string;
    data: {
        pageNo: number;
        pageSize: number;
        totalPage: number;
        totalElement: number;
        sortBy: string[];
        items: CourseItem[];
    };
}

export interface GetCoursesParams {
    pageNo?: number;
    pageSize?: number;
    sorts?: string[];
    keyword?: string;
    status?: string;
    visibility?: string;
    teacherName?: string;
    fromDate?: string;
    toDate?: string;
}

export interface UpdateCourseStatusRequest {
    status: string;
}

export interface ReorderLessonsRequest {
    lessonIds: string[];
}

export interface CreateCourseRequest {
    name: string;
    description: string;
    thumbnailUrl: string;
    visibility: string; // "PUBLIC" | "PRIVATE"
}

export interface CreateLessonRequest {
    title: string;
}

export interface UpdateCourseRequest {
    name?: string;
    description?: string;
    thumbnailUrl?: string;
    visibility?: string; // "PUBLIC" | "PRIVATE"
}

export interface UpdateLessonRequest {
    title: string;
}

export interface CreateLessonItemValues {
    title?: string;
    description?: string;
    textContent?: string;
    file?: File | null;
}

export interface ReorderLessonItemsRequest {
    itemIds: string[];
}

export interface CourseStudent {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imgUrl?: string;
    dob?: string;
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
        goal?: string;
        emergencyContact?: string;
        createdAt: string;
        updatedAt: string;
        deleted: boolean;
        stats?: any;
    };
}

export interface CourseStudentsResponse {
    code: number;
    message: string;
    data: CourseStudent[];
}

export interface CourseTeacher {
    id: string;
    fullName: string;
}

export interface CourseTeacherResponse {
    code: number;
    message: string;
    data: CourseTeacher[];
}
