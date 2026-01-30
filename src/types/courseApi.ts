export interface CourseItem {
    id: string;
    name: string;
    thumbnailUrl: string;
    description: string;
    status: string; // e.g., "DRAFT", "PUBLISHED", etc.
    visibility: string; // e.g., "PUBLIC", "PRIVATE"
    teacherName: string;
    schoolName: string;
    updatedAt: string;
    createdAt: string;
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


