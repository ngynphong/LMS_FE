import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { bannerService } from '@/services/bannerService';
import type { BannerTrackingRequest, Banner } from '@/types/banner';
import { useBannerWebSocket } from './useBannerWebSocket';
import { saveLastShownTime, saveDismissedTime } from '@/utils/bannerUtils';

export const useBanners = () => {
  // const queryClient = useQueryClient();

  // Fetch active banners
  const {
    data: bannersResponse,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['activeBanners'],
    queryFn: () => bannerService.getActiveBanners(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, 
    retry: 2,
  });

  // Listen for real-time updates
  useBannerWebSocket(useCallback(() => {
    console.log('[useBanners] Refreshing banners due to WebSocket event');
    refetch();
  }, [refetch]));

  // Track event mutation
  const { mutate: mutateTrackEvent } = useMutation({
    mutationFn: ({ bannerId, eventType }: { bannerId: string; eventType: BannerTrackingRequest['eventType'] }) => {
      // Create request payload
      const request: BannerTrackingRequest = {
        eventType,
        // Optional tracking data can be collected here
        userAgent: navigator.userAgent,
      };
      
      // Attempt to get user ID if implemented in auth
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.id) request.userId = user.id;
        }
      } catch (e) {
        // Ignored
      }
      
      return bannerService.trackEvent(bannerId, request);
    },
    // Don't refetch on tracking events to save network calls
    onError: (err) => {
      console.error('Failed to track banner event', err);
    }
  });

  const trackEvent = useCallback((bannerId: string, eventType: BannerTrackingRequest['eventType']) => {
    mutateTrackEvent({ bannerId, eventType });
    
    // Đồng bộ trạng thái lưu LocalStorage
    if (eventType === 'IMPRESSION') {
      saveLastShownTime(bannerId);
    } else if (eventType === 'CLOSE') {
      saveDismissedTime(bannerId);
    }
  }, [mutateTrackEvent]);

  const getFilteredBanners = () => {
    const allBanners = (bannersResponse?.data as Banner[]) || [];
    
    // Retrieve user from localStorage
    const userStr = localStorage.getItem('user');
    let userRole = null;
    let isAuthenticated = false;
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        isAuthenticated = true;
        // Typically role is stored as a string or array, get primary role
        userRole = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
      } catch (e) {
        // Ignored
      }
    }

    return allBanners.filter(banner => {
      // 1. Check Visibility Target
      // If PUBLIC, everyone can see it regardless of role
      if (banner.targetVisibility === 'PUBLIC') {
        return true;
      }

      // If it's explicitly AUTHENTICATED but user is not logged in, hide it.
      if (banner.targetVisibility === 'AUTHENTICATED' && !isAuthenticated) {
        return false;
      }

      // 2. Check Roles
      // If banner has targetRoles specified (e.g. STUDENT, TEACHER), restrict it.
      if (banner.targetRoles && banner.targetRoles.length > 0) {
        
        // If not logged in but it requires a specific role, hide it.
        if (!userRole) return false;
        
        // If logged in, check if the user's role falls within targetRoles
        if (!banner.targetRoles.includes(userRole)) {
          return false;
        }
      }

      return true;
    });
  };

  return {
    banners: getFilteredBanners(),
    loading,
    error: error ? (error as Error).message : null,
    trackEvent,
    refetch,
  };
};
