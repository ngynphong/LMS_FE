import type {
    AuthResponse,
    LoginApiResponse,
    JwtPayload,
    User,
    EditProfileRequest,
    EditProfileResponse,
    UploadAvatarResponse,
    ChangePasswordRequest,
    ProfileResponse
} from "../types/auth";
import axiosInstance, { publicAxios } from "../config/axios";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to decode JWT token
export const decodeJWT = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};

// Helper function to map API roles to User role type
const mapRolesToUserRole = (roles: string[]): 'STUDENT' | 'TEACHER' | 'ADMIN' => {
    if (!roles || roles.length === 0) return 'STUDENT';
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('TEACHER')) return 'TEACHER';
    return 'STUDENT';
};

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error) && error.response?.data) {
        const { message, error: errorMsg } = error.response.data;
        throw new Error(message || errorMsg || defaultMessage);
    }
    if (error instanceof Error) throw error;
    throw new Error(defaultMessage);
};

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<LoginApiResponse>('/auth/token', { email, password });

        if (response.data.code !== 1000 && response.data.code !== 0) {
            throw new Error(response.data.message || 'Login failed');
        }

        const { token, authenticated, roles } = response.data.data;

        if (!authenticated || !token) {
            throw new Error('Authentication failed');
        }

        const decodedToken = decodeJWT(token);
        if (!decodedToken) {
            throw new Error('Invalid token format');
        }

        const user: User = {
            id: (decodedToken.userId || decodedToken.id || '').toString(),
            firstName: decodedToken.firstName || '',
            lastName: decodedToken.lastName || '',
            email: decodedToken.email || email,
            imgUrl: decodedToken.imgUrl || decodedToken.avatar || '',
            dob: decodedToken.dob || '',
            role: mapRolesToUserRole(roles),
        };

        return { user, token };
    } catch (error) {
        return handleApiError(error, 'Login failed');
    }
};

export const registerApi = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    roleName: string
): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<AuthResponse>('/auth/register', {
            email,
            password,
            firstName,
            lastName,
            dob,
            roleName
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Registration failed');
    }
};

export const googleLoginApi = async (code: string): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<LoginApiResponse>(`/auth/outbound/authentication?code=${code}`);

        if (response.data.code !== 1000 && response.data.code !== 0) {
            throw new Error(response.data.message || 'Google authentication failed');
        }

        const { token, roles } = response.data.data;
        if (!token) throw new Error('Authentication failed - no token received');

        const decodedToken = decodeJWT(token);
        if (!decodedToken) throw new Error('Invalid token format');

        const user: User = {
            id: (decodedToken.id || '').toString(),
            firstName: decodedToken.firstName || '',
            lastName: decodedToken.lastName || '',
            email: decodedToken.email || '',
            imgUrl: decodedToken.imgUrl || decodedToken.avatar || '',
            dob: decodedToken.dob || '',
            role: mapRolesToUserRole(roles),
        };

        return { user, token };
    } catch (error) {
        return handleApiError(error, 'Google authentication failed');
    }
};

export const updateProfileApi = async (profileData: EditProfileRequest): Promise<User> => {
    try {
        const response = await axiosInstance.put<EditProfileResponse>('/users/me', profileData);

        if (response.data.code !== 1000) {
            throw new Error(response.data.message || 'Failed to update profile');
        }

        const userData = response.data.data;
        let roles: string[] = userData.roles || [];

        // Fallback to token roles if not in response
        if (roles.length === 0) {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                const decodedToken = decodeJWT(currentToken);
                const tokenRoles = decodedToken?.scp || decodedToken?.scopes;
                if (Array.isArray(tokenRoles)) roles = tokenRoles;
            }
        }

        return {
            id: (userData.id || '').toString(),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            imgUrl: userData.imgUrl || '',
            dob: userData.dob || '',
            role: mapRolesToUserRole(roles),
        };
    } catch (error) {
        return handleApiError(error, 'Failed to update profile');
    }
};

export const uploadAvatarApi = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const token = localStorage.getItem('token');

        const response = await axios.post<UploadAvatarResponse>(
            `${API_URL}/users/me/avatar`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.data.code !== 1000 && response.data.code !== 0) {
            throw new Error(response.data.message || 'Failed to upload avatar');
        }

        const newImgUrl = response.data.data.imgUrl;

        // Update cached user
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                const parsed = JSON.parse(storedUser);
                localStorage.setItem('user', JSON.stringify({ ...parsed, imgUrl: newImgUrl }));
            }
        } catch (e) {
            console.warn('Failed to update cached user after avatar upload:', e);
        }

        return newImgUrl;
    } catch (error) {
        return handleApiError(error, 'Failed to upload avatar');
    }
};

export const forgotPasswordApi = async (email: string): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<AuthResponse>('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Password reset request failed');
    }
};

export const changePasswordApi = async (changePassword: ChangePasswordRequest): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<AuthResponse>('/auth/change-password', changePassword);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Password change failed');
    }
};

export const verifyEmailApi = async (email: string, token: string): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<AuthResponse>('/auth/verify-email', { email, token });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Email verification failed');
    }
};

export const verifyOtpApi = async (email: string, otp: string, newPassword: string): Promise<AuthResponse> => {
    try {
        const response = await publicAxios.post<AuthResponse>('/auth/verify-otp', { email, otp, newPassword });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'OTP verification failed');
    }
};

export const refreshTokenApi = async (token: string): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>('/auth/refresh-token', { token });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'Token refresh failed');
    }
};

export const logoutApi = async (token: string): Promise<void> => {
    try {
        await axiosInstance.post('/auth/logout', { token });
    } catch (error) {
        // Don't throw error on logout - always proceed with local cleanup
        console.error('Logout API error:', error);
    }
};

// export const getCurrentUserApi = async (): Promise<AuthResponse> => {
//     try {
//         const response = await axiosInstance.get('/users/me');

//         if (response.data.code !== 1000) {
//             throw new Error(response.data.message || 'Failed to fetch user profile');
//         }

//         const userData = response.data.data;
//         if (!userData) throw new Error('Invalid user data received from API');

//         // Get roles from token
//         const currentToken = localStorage.getItem('token');
//         let roles: string[] = [];

//         if (currentToken) {
//             const decodedToken = decodeJWT(currentToken);
//             const tokenRoles = decodedToken?.scp || decodedToken?.scopes;
//             if (Array.isArray(tokenRoles)) {
//                 roles = tokenRoles;
//             }
//         }

//         // Fallback to profile data
//         if (roles.length === 0) {
//             if (userData.roles && Array.isArray(userData.roles)) {
//                 roles = userData.roles;
//             } else if (userData.role && typeof userData.role === 'string') {
//                 roles = [userData.role.toUpperCase()];
//             }
//         }

//         const user: User = {
//             id: (userData.id || '').toString(),
//             firstName: userData.firstName || '',
//             lastName: userData.lastName || '',
//             email: userData.email || '',
//             imgUrl: userData.imgUrl || '',
//             dob: userData.dob || '',
//             role: mapRolesToUserRole(roles),
//             teacherProfile: userData.teacherProfile,
//             studentProfile: userData.studentProfile,
//         };

//         return { user, token: '' };
//     } catch (error) {
//         return handleApiError(error, 'Failed to fetch user profile');
//     }
// };

export const getCurrentUserApi = async (): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.get<ProfileResponse>('/my-profile');

        if (response.data.code !== 1000 && response.data.code !== 0) {
            throw new Error(response.data.message || 'Failed to fetch user profile');
        }

        const profileData = response.data.data;

        // Get roles and basic info from token
        const currentToken = localStorage.getItem('token');
        let roles: string[] = [];
        let decodedToken: JwtPayload | null = null;

        if (currentToken) {
            decodedToken = decodeJWT(currentToken);
            const tokenRoles = decodedToken?.scp || decodedToken?.scopes;
            if (Array.isArray(tokenRoles)) {
                roles = tokenRoles;
            }
        }

        const user: User = {
            id: profileData.id,
            // If API doesn't return name/email, use from token or empty
            firstName: decodedToken?.firstName || '',
            lastName: decodedToken?.lastName || '',
            email: decodedToken?.email || '',
            imgUrl: decodedToken?.imgUrl || decodedToken?.avatar || '',
            dob: decodedToken?.dob || '',
            role: mapRolesToUserRole(roles),
            studentProfile: {
                id: profileData.id,
                schoolName: profileData.schoolName,
                emergencyContact: profileData.emergencyContact,
                parentPhone: '', // Not in profileData
                goal: profileData.goal,
                stats: profileData.stats
            },
        };

        return { user, token: currentToken || '' };
    } catch (error) {
        return handleApiError(error, 'Failed to fetch user profile');
    }
};
