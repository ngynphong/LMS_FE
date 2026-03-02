import axiosInstance from "@/config/axios";
import type { NotificationResponse, GetNotificationsParams } from "@/types/notification";

export const notificationService = {
  getNotifications: async (params?: GetNotificationsParams): Promise<NotificationResponse> => {
    const response = await axiosInstance.get('/notifications', { params });
    // Assuming backend wraps response in typical base format, or returns page directly
    return response.data?.data || response.data;
  },

  markRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${id}/mark-read`);
  },

  markReadAll: async (): Promise<void> => {
    await axiosInstance.post('/notifications/mark-read-all');
  },
};
