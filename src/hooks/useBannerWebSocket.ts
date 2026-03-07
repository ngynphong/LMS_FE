import { useEffect, useContext, useRef } from 'react';
import { WebSocketContext } from '@/contexts/WebSocketContext';
import { type StompSubscription } from '@stomp/stompjs';

export interface BannerEvent {
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'EXPIRED';
  bannerId: string | null;
  timestamp: string;
}

export const useBannerWebSocket = (onEvent: (event: BannerEvent) => void) => {
  const context = useContext(WebSocketContext);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    if (!context || !context.isConnected) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      return;
    }

    // Tránh subscribe nhiều lần nếu đã có subscription
    if (subscriptionRef.current) return;

    try {
      const subscription = context.subscribe('/topic/banners', (data) => {
        onEvent(data as BannerEvent);
      });

      if (subscription) {
        subscriptionRef.current = subscription;
      }
    } catch (error) {
      console.error('[BannerWS] Error subscribing to /topic/banners:', error);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [context?.isConnected, context?.subscribe, onEvent]);

  return {
    isConnected: context?.isConnected || false,
    reconnect: () => {
      // Reconnect logic is handled by global WebSocketProvider
    },
    disconnect: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    },
  };
};
