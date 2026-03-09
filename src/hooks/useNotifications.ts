import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";

export const useNotifications = (pageNo = 1, pageSize = 20, sort = "createdAt:desc") => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Only hook if user is logged in
  const { isConnected, subscribe } = useWebSocket();

  const query = useInfiniteQuery({
    queryKey: ["notifications", { pageSize, sort }],
    queryFn: ({ pageParam = pageNo }) => 
      notificationService.getNotifications({ 
        pageNo: pageParam as number, 
        pageSize: pageSize, 
        sort 
      }),
    initialPageParam: pageNo,
    getNextPageParam: (lastPage: any) => {
      // Handle potential response formats (Page object or direct array)
      const number = lastPage.number ?? lastPage.pageable?.pageNumber ?? lastPage.pageNo;
      const currentPage = number !== undefined ? (typeof number === 'string' ? parseInt(number) : number) : undefined;
      const totalPages = lastPage.totalPages ?? 0;
      
      // If we have an explicit page index and totalPages
      if (currentPage !== undefined && totalPages > 0) {
        return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
      }

      // Fallback: If it's a direct array or we don't have totalPages, we might use 'last' flag
      if (lastPage.last === true) return undefined;
      
      // Last resort: check if we got a full page
      const items = lastPage.content || lastPage.data || lastPage.items || (Array.isArray(lastPage) ? lastPage : []);
      if (items.length < pageSize || items.length === 0) return undefined;
      
      // If we don't know the current page but got a full list, increment whatever we used
      return (currentPage ?? 0) + 1;
    },
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
