import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useWebSocket } from "./useWebSocket";

export const useNotifications = (page = 0, size = 10, sort = "createdAt,desc") => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Only hook if user is logged in
  const { isConnected, subscribe } = useWebSocket();

  const query = useQuery({
    queryKey: ["notifications", { page, size, sort }],
    queryFn: () => notificationService.getNotifications({ page, size, sort }),
    enabled: !!user, // Enable only when authenticated
    refetchInterval: 60000, // Refetch every minute as fallback
  });

  // WebSocket Integration for real-time bell
  useEffect(() => {
    if (!user || !isConnected) return;

    let subscription: any;

    const setupWebSocket = () => {
      subscription = subscribe('/queue/notifications', (_newNotif) => {
        // Invalidate all notification queries to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    };

    setupWebSocket();

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [user, isConnected, queryClient, subscribe]);

  return query;
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markReadAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
