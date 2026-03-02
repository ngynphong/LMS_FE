import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminService from "@/services/adminService";
import type { CreateTeacherRequest, ResetPasswordRequest } from "@/types/admin";
import { toast } from "@/components/common/Toast"; // Hook to fetch dashboard stats
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminService.getAdminDashboardStats,
  });
};

export const useSystemLogs = (page: number, size: number) => {
    return useQuery({
        queryKey: ['admin', 'logs', page, size],
        queryFn: () => adminService.getSystemLogs(page, size),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherRequest) => adminService.createTeacherAccount(data),
    onSuccess: () => {
      toast.success("Tạo tài khoản giáo viên thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản");
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ResetPasswordRequest }) =>
      adminService.resetUserPassword(userId, data),
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    },
  });
};
