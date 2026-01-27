import type { TeacherProfileData } from "./teacherProfile";
import type { StudentProfile } from "./user";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    urlImg: string;
    dob: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    teacherProfile?: TeacherProfileData;
    studentProfile?: StudentProfile;
};

export interface LoginApiResponse {
    code: number;
    message: string;
    data: {
        token: string;
        authenticated: boolean;
        roles: string[];
    };
};

export interface JwtPayload {
    userId?: number;
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    urlImg?: string;
    avatar?: string;
    dob?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}

export interface AuthResponse {
    user: User;
    token: string;
};

export interface AuthContextType {
    handleAuthResponse: (response: { user: User, token: string }) => void;
    updateAuthFromStorage: () => void;
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    initialLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<string | null>;
    register: (email: string, password: string, firstName: string, lastName: string, dob: string, roleName: string) => Promise<void>;
    loginWithGoogle: (code: string) => Promise<void>;
    verifyEmail: (email: string, token: string) => Promise<void>;
    verifyOtp: (email: string, otp: string, newPassword: string) => Promise<void>;
    logout: () => void;
    forceLogout: () => void;
    forgotPassword: (email: string) => Promise<void>;
    changePassword: (changePassword: ChangePasswordRequest) => Promise<void>;
    refreshToken: (token: string) => Promise<void>;
};

export interface EditProfileRequest {
    firstName: string;
    lastName: string;
    dob: string; // ISO date string
}

export interface EditProfileResponse {
    code: number;
    message: string;
    data: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        urlImg: string;
        dob: string;
        roles: string[];
    };
}

export interface UploadAvatarResponse {
    code: number;
    message: string;
    data: {
        urlImg: string;
    };
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    token: string;
}

export interface ProfileStats {
    totalCourses: number;
    completedCourses: number;
    overallProgress: number;
}

// Nested user object trong ProfileData
export interface ProfileUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    imgUrl: string;
    dob: string;
    roles: string[];
    teacherProfile: unknown | null;
    studentProfile: unknown | null;
}

export interface ProfileData {
    id: string;
    schoolName: string | null;
    goal: string | null;
    emergencyContact: string | null;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    user: ProfileUser;
    stats: ProfileStats;
}

export interface ProfileResponse {
    code: number;
    message: string;
    data: ProfileData;
}
