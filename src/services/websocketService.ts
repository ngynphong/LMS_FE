// src/services/WebSocketService.ts
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    private client: Client;
    private isConnected: boolean = false;

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
            debug: (str) => {
                if (import.meta.env.MODE === 'development') {
                    console.log('[WS Debug]:', str);
                }
            },
        });

        // Callback khi có lỗi
        this.client.onStompError = (frame) => {
            console.error('❌ Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
    }

    // Hàm kết nối (Gọi khi User Login thành công)
    connect(token: string, onConnectCallback?: () => void) {
        if (this.isConnected) return;

        // Gửi Token vào Header để UserHeaderInterceptor ở Backend bắt được
        this.client.connectHeaders = {
            Authorization: `Bearer ${token}` 
        };

        this.client.onConnect = () => {
            console.log('✅ Connected to WebSocket');
            this.isConnected = true;
            if (onConnectCallback) onConnectCallback();
        };

        this.client.activate();
    }

    // Hàm ngắt kết nối (Gọi khi Logout)
    disconnect() {
        if (this.isConnected) {
            this.client.deactivate();
            this.isConnected = false;
            console.log('🔌 Disconnected');
        }
    }

    // Hàm Subscribe (Nhận dữ liệu)
    subscribe(destination: string, callback: (payload: any) => void) {
        if (!this.client.connected) {
            console.warn('⚠️ Client chưa kết nối, không thể subscribe:', destination);
            return;
        }

        return this.client.subscribe(destination, (message: IMessage) => {
            try {
                // Parse JSON từ Backend gửi về
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error('Lỗi parse JSON WebSocket:', error);
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