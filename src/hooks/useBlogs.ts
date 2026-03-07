import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blogService';
import type { CreateBlogPayload } from '../types/blog';

export const usePublicBlogs = (page = 1, limit = 10, tag?: string, keyword?: string, sorts?: string[]) => {
  return useQuery({
    queryKey: ['publicBlogs', page, limit, tag, keyword, sorts],
    queryFn: () => blogService.getPublishedBlogs(page, limit, tag, keyword, sorts),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: ['blogDetail', slug],
    queryFn: () => blogService.getBlogBySlug(slug),
    enabled: !!slug,
  });
};

export const useAdminBlogDetail = (id: string) => {
  return useQuery({
    queryKey: ['adminBlogDetail', id],
    queryFn: () => blogService.getBlogById(id),
    enabled: !!id,
  });
};

// Admin Hooks
export const useAdminBlogs = (page = 1, limit = 10, tag?: string, keyword?: string, sorts?: string[]) => {
  return useQuery({
    queryKey: ['adminBlogs', page, limit, tag, keyword, sorts],
    queryFn: () => blogService.getAllBlogsAdmin(page, limit, tag, keyword, sorts),
  });
};

export const useAdminBlogMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBlogPayload }) => 
      blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogDetail'] });
      queryClient.invalidateQueries({ queryKey: ['adminBlogDetail'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      queryClient.invalidateQueries({ queryKey: ['publicBlogs'] });
    },
  });

  return {
    createBlog: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateBlog: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteBlog: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};