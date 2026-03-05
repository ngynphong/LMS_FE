import { useEffect, useCallback, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'https://dev-ies-edu.online/api/v1/ws';

export interface BannerEvent {
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'EXPIRED';
  bannerId: string | null;
  timestamp: string;
}

export const useBannerWebSocket = (onEvent: (event: BannerEvent) => void) => {
  const stompClientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? {
        Authorization: `Bearer ${token}`,
      } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe('/topic/banners', (message) => {
        try {
          const event: BannerEvent = JSON.parse(message.body);
          onEvent(event);
        } catch (error) {
         
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };

    client.onWebSocketClose = () => {
      
    };

    client.activate();
    stompClientRef.current = client;
  }, [onEvent]);

  const disconnect = useCallback(() => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected: stompClientRef.current?.connected || false,
    reconnect: connect,
    disconnect,
  };
};
