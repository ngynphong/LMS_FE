import axiosInstance, { publicAxios } from '../config/axios';
import type { BlogPost, BlogListResponse, CreateBlogPayload, ApiResponse, BlogDetailResponse } from '../types/blog';

export const blogService = {
  // Public API
  getPublishedBlogs: async (page = 1, limit = 10, tag?: string) => {
    const response = await publicAxios.get<ApiResponse<BlogListResponse>>('/blogs', {
      params: { pageNo: page, pageSize: limit, tag }
    });
    return response.data;
  },

  getBlogBySlug: async (slug: string) => {
    const response = await publicAxios.get<ApiResponse<BlogDetailResponse>>(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Admin API
  getAllBlogsAdmin: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get<ApiResponse<BlogListResponse>>('/blogs', {
      params: { pageNo: page, pageSize: limit }
    });
    return response.data;
  },

  getBlogById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<BlogPost>>(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (data: CreateBlogPayload) => {
    const response = await axiosInstance.post<ApiResponse<BlogPost>>('/blogs', data);
    return response.data;
  },

  updateBlog: async (id: string, data: CreateBlogPayload) => {
    const response = await axiosInstance.put<ApiResponse<BlogPost>>(`/blogs/${id}`, data);
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/blogs/${id}`);
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post<ApiResponse<{ fileKey: string }>>('/blogs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};