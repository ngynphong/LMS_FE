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
    // Chỉ connect khi đã authenticated và có token
    if (isAuthenticated && token) {

      socketService.connect(token, () => {
        setIsConnected(true);
        const connectTimestamp = Date.now(); // Lưu thời điểm kết nối thành công

        // Subscribe to force-logout topic immediately after connection
        socketService.subscribe("/user/queue/force-logout", (data) => {
          if (data.type === "FORCE_LOGOUT") {
            const timeSinceConnect = Date.now() - connectTimestamp;
            if (timeSinceConnect < 2000) {
              // console.warn(
              //   "[WS] Đã bỏ qua message FORCE_LOGOUT do nhận được quá sớm sau khi kết nối (có thể do Refresh trang/Reconnect):",
              //   timeSinceConnect,
              //   "ms",
              // );
              return;
            }

            // Hiển thị modal thay vì alert
            setLogoutModal({
              isOpen: true,
              message: data.message || "Tài khoản đã đăng nhập ở thiết bị khác",
            });
          }
        });
      });

      return () => {
        // console.log("Cleaning up WebSocket connection...");
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
