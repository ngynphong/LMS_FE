import React, { useState, useEffect, useCallback } from "react";
import { type StompSubscription } from "@stomp/stompjs";
import { useAuth } from "../hooks/useAuth";
import { socketService } from "../services/websocketService";
import { WebSocketContext } from "./WebSocketContext";

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Chỉ connect khi đã authenticated và có token
    if (isAuthenticated && token) {
      console.log("Initializing WebSocket connection...");

      socketService.connect(token, () => {
        setIsConnected(true);
      });

      return () => {
        console.log("Cleaning up WebSocket connection...");
        socketService.disconnect();
        setIsConnected(false);
      };
    } else {
      // logout -> disconnect
      socketService.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated, token]);

  const subscribe = useCallback(
    (
      topic: string,
      callback: (payload: any) => void,
    ): StompSubscription | undefined => {
      // socketService.subscribe đã handle check connected
      return socketService.subscribe(topic, callback);
    },
    [],
  );

  const sendMessage = useCallback((destination: string, body: any) => {
    // socketService.send đã handle check connected
    socketService.send(destination, body);
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
