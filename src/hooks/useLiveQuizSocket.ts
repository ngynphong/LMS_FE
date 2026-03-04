import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type {
    WsPlayerEvent,
    WsPlayerJoinedData,
    LiveQuizLeaderboardItem
} from '@/types/live-quiz';
import { useAuth } from './useAuth';

const WS_URL = import.meta.env.VITE_WS_URL;

export const useLiveQuizSocket = (pin: string | null, role: 'HOST' | 'PLAYER') => {
    const { token } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);

    // Host States
    const [playersList, setPlayersList] = useState<WsPlayerJoinedData['data'][]>([]);

    // Player States
    const [lastPlayerEvent, setLastPlayerEvent] = useState<WsPlayerEvent | null>(null);

    // Shared States
    const [leaderboard, setLeaderboard] = useState<LiveQuizLeaderboardItem[]>([]);

    // Disconnect method to clean up
    const disconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        if (!pin) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            connectHeaders: token ? {
                Authorization: `Bearer ${token}`
            } : {},
            // debug: (str) => {
            //     // console.log('[STOMP]', str);
            // },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);

                // Subscribe depending on role
                if (role === 'HOST') {
                    client.subscribe(`/topic/quiz.${pin}.host`, (message) => {
                        try {
                            const event: WsPlayerJoinedData = JSON.parse(message.body);
                            if (event.type === 'PLAYER_JOINED') {
                                setPlayersList(prev => {
                                    if (prev.find(p => p.studentId === event.data.studentId)) return prev;
                                    return [...prev, event.data];
                                });
                            }
                        } catch (e) {
                            console.error('Failed to parse host message', e);
                        }
                    });
                } else if (role === 'PLAYER') {
                    client.subscribe(`/topic/quiz.${pin}.players`, (message) => {
                        try {
                            const data: WsPlayerEvent = JSON.parse(message.body);
                            setLastPlayerEvent(data);
                        } catch (e) {
                            console.error('Failed to parse player message', e);
                        }
                    });
                }

                // Both subscribe to leaderboard
                client.subscribe(`/topic/quiz.${pin}.leaderboard`, (message) => {
                    try {
                        const data: LiveQuizLeaderboardItem[] = JSON.parse(message.body);
                        setLeaderboard(data);
                    } catch (e) {
                        console.error('Failed to parse leaderboard message', e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketClose: () => {
                setIsConnected(false);
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            disconnect();
        };
    }, [pin, role, token, disconnect]);


    return {
        isConnected,
        playersList,
        lastPlayerEvent,
        leaderboard,
        disconnect
    };
};
