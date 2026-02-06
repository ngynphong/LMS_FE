import { createContext } from "react";
import type { StompSubscription } from "@stomp/stompjs";

export interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (
    topic: string,
    callback: (payload: any) => void,
  ) => StompSubscription | undefined;
  sendMessage: (destination: string, body: any) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null,
);
