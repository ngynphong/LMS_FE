// src/services/WebSocketService.ts
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    private client: Client;
    

    constructor() {
        this.client = new Client({
            // Cấu hình quan trọng cho SockJS
            webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL),
            
            // Tự động kết nối lại sau 5s nếu mất mạng
            reconnectDelay: 5000,
            
            // Nhịp tim để giữ kết nối (Heartbeat)
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            // Log để debug (Tắt khi lên Production)
            // debug: (str) => {
            //     if (import.meta.env.MODE === 'development') {
            //         console.log('[WS Debug]:', str);
            //     }
            // },
        });

        // Callback khi có lỗi từ Broker
        this.client.onStompError = (frame) => {
            const errorMessage = frame.headers['message'];
            // Chỉ log lỗi nếu không phải là thông báo ngắt kết nối thông thường
            if (import.meta.env.MODE === 'development' && !errorMessage?.includes('closed')) {
                console.error('❌ Broker reported error: ' + errorMessage);
                console.error('Additional details: ' + frame.body);
            }
        };

        // Cập nhật trạng thái khi đóng kết nối
        this.client.onWebSocketClose = () => {
        };

        this.client.onDisconnect = () => {
        };
    }

    // Hàm kết nối (Gọi khi User Login thành công hoặc vào quiz với tư cách khách)
    connect(token?: string, onConnectCallback?: () => void) {
        // Gửi Token vào Header để UserHeaderInterceptor ở Backend bắt được (nếu có)
        this.client.connectHeaders = token ? {
            Authorization: `Bearer ${token}` 
        } : {};

        if (onConnectCallback) {
            this.client.onConnect = () => {
                onConnectCallback();
            };
        }

        this.client.activate();
    }

    // Getter để check status trực tiếp từ client
    get isConnected(): boolean {
        return this.client.connected;
    }

    // Setter để hook vào các event từ bên ngoài (ví dụ Provider)
    set onConnect(callback: () => void) {
        this.client.onConnect = callback;
    }

    set onDisconnect(callback: () => void) {
        this.client.onDisconnect = callback;
    }

    set onStompError(callback: (frame: any) => void) {
        this.client.onStompError = callback;
    }

    // Hàm ngắt kết nối (Gọi khi Logout)
    disconnect() {
        this.client.deactivate();
    }

    // Hàm Subscribe (Nhận dữ liệu)
    subscribe(destination: string, callback: (payload: any) => void) {
        if (!this.client.active) {
            // console.warn('⚠️ Client chưa active, không thể subscribe:', destination);
            return;
        }

        return this.client.subscribe(destination, (message: IMessage) => {
            try {
                // Parse JSON từ Backend gửi về
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                // console.error('Lỗi parse JSON WebSocket:', error);
            }
        });
    }

    // Hàm Gửi dữ liệu (Nếu cần chat realtime)
    send(destination: string, body: any) {
        if (!this.client.connected) return;
        
        this.client.publish({
            destination: destination,
            body: JSON.stringify(body)
        });
    }
}

// Export một instance duy nhất (Singleton)
export const socketService = new WebSocketService();