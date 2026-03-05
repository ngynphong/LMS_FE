import axiosInstance, { publicAxios } from '../config/axios';
import type { Banner, BannerTrackingRequest, PagedResponse, ApiResponse, BannerCreationRequest } from '../types/banner.types';

class BannerService {
  /**
   * Fetch all active banners based on user role and current time
   */
  async getActiveBanners(): Promise<ApiResponse<Banner[]>> {
    // Determine if user is authenticated to use appropriate axios instance
    const token = localStorage.getItem('token');
    const axiosClient = token ? axiosInstance : publicAxios;
    
    const response = await axiosClient.get<ApiResponse<Banner[]>>('/banners/active');
    return response.data;
  }

  /**
   * Track user interactions with banners
   */
  async trackEvent(bannerId: string, request: BannerTrackingRequest): Promise<void> {
    const token = localStorage.getItem('token');
    const axiosClient = token ? axiosInstance : publicAxios;
    
    await axiosClient.post(`/banners/${bannerId}/track`, request);
  }

  /**
   * Create a new banner (ADMIN only)
   */
  async createBanner(data: BannerCreationRequest, imageDesktop: File, imageMobile?: File, imageTablet?: File): Promise<ApiResponse<Banner>> {
    const formData = new FormData();
    formData.append('imageDesktop', imageDesktop);
    
    if (imageMobile) {
      formData.append('imageMobile', imageMobile);
    }
    if (imageTablet) {
      formData.append('imageTablet', imageTablet);
    }

    // Convert data to query parameters as expected by the backend
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((val) => params.append(key, String(val)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await axiosInstance.post<ApiResponse<Banner>>('/banners', formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * List all banners indicating filters (ADMIN only)
   */
  async getAllBanners(params: { keyword?: string; page?: number; size?: number }): Promise<ApiResponse<PagedResponse<Banner>>> {
    const response = await axiosInstance.get<ApiResponse<PagedResponse<Banner>>>('/banners', { params });
    return response.data;
  }

  /**
   * Get banner details by ID (ADMIN only)
   */
  async getBannerById(id: string): Promise<ApiResponse<Banner>> {
    const response = await axiosInstance.get<ApiResponse<Banner>>(`/banners/${id}`);
    return response.data;
  }

  /**
   * Update an existing banner (ADMIN only)
   */
  async updateBanner(id: string, data: BannerCreationRequest, imageDesktop?: File, imageMobile?: File, imageTablet?: File): Promise<ApiResponse<Banner>> {
    const formData = new FormData();
    if (imageDesktop) formData.append('imageDesktop', imageDesktop);
    if (imageMobile) formData.append('imageMobile', imageMobile);
    if (imageTablet) formData.append('imageTablet', imageTablet);

    // Convert data to query parameters
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((val) => params.append(key, String(val)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await axiosInstance.put<ApiResponse<Banner>>(`/banners/${id}`, formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Delete a banner (ADMIN only)
   */
  async deleteBanner(id: string): Promise<void> {
    await axiosInstance.delete(`/banners/${id}`);
  }
}

export const bannerService = new BannerService();
