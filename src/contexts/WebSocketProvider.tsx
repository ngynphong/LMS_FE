import React, { useState, useEffect, useCallback } from "react";
import { type StompSubscription } from "@stomp/stompjs";
import { useAuth } from "@/hooks/useAuth";
import { socketService } from "@/services/websocketService";
import { WebSocketContext } from "@/contexts/WebSocketContext";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [logoutModal, setLogoutModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    let logoutSub: any;

    const checkLogout = (data: any) => {
      if (data.type === "FORCE_LOGOUT") {
        setLogoutModal({
          isOpen: true,
          message: data.message || "Tài khoản đã đăng nhập ở thiết bị khác",
        });
      }
    };

    // Subscribe ngay khi connect thành công (kể cả khi reconnect)
    socketService.onConnect = () => {
      setIsConnected(true);
      if (isAuthenticated) {
        if (logoutSub) logoutSub.unsubscribe();
        logoutSub = socketService.subscribe(
          "/user/queue/force-logout",
          checkLogout,
        );
      }
    };

    socketService.onDisconnect = () => {
      setIsConnected(false);
    };

    // Luôn cố gắng connect để hỗ trợ cả người dùng Guest vào Live Quiz
    socketService.connect(token || undefined);

    // Dự phòng: Sync trạng thái định kỳ hoặc khi component mount
    const interval = setInterval(() => {
      if (socketService.isConnected !== isConnected) {
        setIsConnected(socketService.isConnected);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (logoutSub) logoutSub.unsubscribe();
      socketService.disconnect();
      setIsConnected(false);
    };
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

  const handleLogoutConfirm = () => {
    // Disconnect WebSocket
    socketService.disconnect();

    // Xóa token, user và redirect về login
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển hướng
    window.location.href = "/login";
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, sendMessage }}>
      {children}
      <ConfirmationModal
        isOpen={logoutModal.isOpen}
        title="Thông báo đăng nhập"
        message={logoutModal.message}
        onConfirm={handleLogoutConfirm}
        onClose={handleLogoutConfirm}
        confirmLabel="Đăng nhập lại"
        cancelLabel="Đóng"
        variant="warning"
      />
    </WebSocketContext.Provider>
  );
};
