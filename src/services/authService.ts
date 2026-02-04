import type {
    AuthResponse,
    LoginApiResponse,
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

        // Save token first to use for /my-profile call
        localStorage.setItem('token', token);

        // Fetch profile data from API
        try {
            const profileResponse = await axiosInstance.get<ProfileResponse>('/my-profile');
            if (profileResponse.data.code === 1000 || profileResponse.data.code === 0) {
                const profileData = profileResponse.data.data;
                const userData = profileData.user;
                const user: User = {
                    id: userData.id,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || email,
                    urlImg: userData.imgUrl || '',
                    dob: userData.dob || '',
                    role: mapRolesToUserRole(userData.roles || roles),
                    studentProfile: {
                        id: profileData.id,
                        schoolName: profileData.schoolName || '',
                        emergencyContact: profileData.emergencyContact || '',
                        goal: profileData.goal || '',
                        stats: profileData.stats
                    },
                };
                return { user, token };
            }
        } catch {
            // If profile fetch fails, create minimal user from login response
            console.warn('Failed to fetch profile after login, using minimal user data');
        }

        // Fallback: create minimal user from login response only
        const user: User = {
            id: '',
            firstName: '',
            lastName: '',
            email: email,
            urlImg: '',
            dob: '',
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

        // Save token first to use for /my-profile call
        localStorage.setItem('token', token);

        // Fetch profile data from API
        try {
            const profileResponse = await axiosInstance.get<ProfileResponse>('/my-profile');
            if (profileResponse.data.code === 1000 || profileResponse.data.code === 0) {
                const profileData = profileResponse.data.data;
                const userData = profileData.user;
                const user: User = {
                    id: userData.id,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    urlImg: userData.imgUrl || '',
                    dob: userData.dob || '',
                    role: mapRolesToUserRole(userData.roles || roles),
                    studentProfile: {
                        id: profileData.id,
                        schoolName: profileData.schoolName || '',
                        emergencyContact: profileData.emergencyContact || '',
                        goal: profileData.goal || '',
                        stats: profileData.stats
                    },
                };
                return { user, token };
            }
        } catch {
            console.warn('Failed to fetch profile after Google login, using minimal user data');
        }

        // Fallback: create minimal user
        const user: User = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            urlImg: '',
            dob: '',
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
        const roles: string[] = userData.roles || [];

        return {
            id: (userData.id || '').toString(),
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            urlImg: userData.urlImg || '',
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

        const newImgUrl = response.data.data.urlImg;

        // Update cached user
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                const parsed = JSON.parse(storedUser);
                localStorage.setItem('user', JSON.stringify({ ...parsed, urlImg: newImgUrl }));
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

interface VerifyOtpApiResponse {
    code: number;
    message: string;
    data?: unknown;
}

export const verifyOtpApi = async (email: string, otp: string, newPassword: string): Promise<void> => {
    try {
        const response = await publicAxios.post<VerifyOtpApiResponse>('/auth/verify-otp', { email, otp, newPassword });
        
        // Check response code - throw error if not success
        if (response.data.code !== 1000 && response.data.code !== 0) {
            throw new Error(response.data.message || 'OTP verification failed');
        }
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

export const getCurrentUserApi = async (): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.get<ProfileResponse>('/my-profile');

        if (response.data.code !== 1000 && response.data.code !== 0) {
            throw new Error(response.data.message || 'Failed to fetch user profile');
        }

        const profileData = response.data.data;
        const currentToken = localStorage.getItem('token');
        const userData = profileData.user;

        // Get roles from user data (API response)
        const roles = userData.roles || [];

        const user: User = {
            id: userData.id,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            urlImg: userData.imgUrl || '',
            dob: userData.dob || '',
            role: mapRolesToUserRole(roles),
            studentProfile: {
                id: profileData.id,
                schoolName: profileData.schoolName || '',
                emergencyContact: profileData.emergencyContact || '',
                goal: profileData.goal || '',
                stats: profileData.stats
            },
        };

        return { user, token: currentToken || '' };
    } catch (error) {
        return handleApiError(error, 'Failed to fetch user profile');
    }
};

export const loginWithCustomToken = async (token: string): Promise<AuthResponse> => {
    try {
        // Save token first
        localStorage.setItem('token', token);

        // Fetch profile data
        const profileResponse = await axiosInstance.get<ProfileResponse>('/my-profile');
        
        if (profileResponse.data.code !== 1000 && profileResponse.data.code !== 0) {
             throw new Error(profileResponse.data.message || 'Failed to fetch user profile with custom token');
        }
        
        const profileData = profileResponse.data.data;
        const userData = profileData.user;
        const user: User = {
             id: userData.id,
             firstName: userData.firstName || '',
             lastName: userData.lastName || '',
             email: userData.email || '',
             urlImg: userData.imgUrl || '',
             dob: userData.dob || '',
             role: mapRolesToUserRole(userData.roles || []),
             studentProfile: {
                 id: profileData.id,
                 schoolName: profileData.schoolName || '',
                 emergencyContact: profileData.emergencyContact || '',
                 goal: profileData.goal || '',
                 stats: profileData.stats
             },
         };

         return { user, token };

    } catch (error) {
        // If failed, clear token to avoid bad state
        localStorage.removeItem('token');
        return handleApiError(error, 'Login with custom token failed');
    }
};
