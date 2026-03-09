import { useEffect, useState, useCallback, useRef } from 'react';
import { type StompSubscription } from '@stomp/stompjs';
import type {
    WsPlayerEvent,
    WsPlayerJoinedData,
    WsPlayerJoinedEvent,
    LiveQuizLeaderboardItem
} from '@/types/live-quiz';
import { socketService } from '@/services/websocketService';
import { useWebSocket } from './useWebSocket'; // Assuming this provides isConnected status from context

export const useLiveQuizSocket = (pin: string | null, role: 'HOST' | 'PLAYER') => {
    const { isConnected } = useWebSocket();
    
    // Host States
    const [playersList, setPlayersList] = useState<WsPlayerJoinedData[]>([]);

    // Player States
    const [lastPlayerEvent, setLastPlayerEvent] = useState<WsPlayerEvent | null>(null);

    // Shared States
    const [leaderboard, setLeaderboard] = useState<LiveQuizLeaderboardItem[]>([]);

    const subscriptionsRef = useRef<StompSubscription[]>([]);

    const unsubscribeAll = useCallback(() => {
        // console.log(`[LiveQuiz] Unsubscribing from all topics for pin: ${pin}`);
        subscriptionsRef.current.forEach(sub => sub.unsubscribe());
        subscriptionsRef.current = [];
    }, [pin]);

    useEffect(() => {
        if (!pin || !isConnected) return;

        // console.log(`[LiveQuiz] Initializing subscriptions for pin: ${pin}, role: ${role}`);
        
        // Host Subscriptions
        if (role === 'HOST') {
            const hostSub = socketService.subscribe(`/topic/quiz.${pin}.host`, (data) => {
                // console.log('[LiveQuiz] Received Host Event:', data);
                try {
                    const event = data as WsPlayerJoinedEvent;
                    if (event.type === 'PLAYER_JOINED') {
                        setPlayersList(prev => {
                            if (prev.find(p => p.studentId === event.data.studentId)) return prev;
                            return [...prev, event.data];
                        });
                    }
                } catch (e) {
                    console.error('[LiveQuiz] Failed to parse host message', e);
                }
            });
            if (hostSub) subscriptionsRef.current.push(hostSub);
        } 
        
        // Player Subscriptions
        if (role === 'PLAYER') {
            const playerSub = socketService.subscribe(`/topic/quiz.${pin}.players`, (data) => {
                // console.log('[LiveQuiz] Received Player Event:', data);
                try {
                    // Handle wrapped data if necessary (consistent with old logic)
                    const event: WsPlayerEvent = data.code !== undefined && data.data ? data.data : data;
                    if (event && event.type) {
                        setLastPlayerEvent(event);
                    }
                } catch (e) {
                    console.error('[LiveQuiz] Failed to parse player message', e);
                }
            });
            if (playerSub) subscriptionsRef.current.push(playerSub);
        }

        // Shared Leaderboard Subscription
        const lbSub = socketService.subscribe(`/topic/quiz.${pin}.leaderboard`, (data) => {
            // console.log('[LiveQuiz] Received Leaderboard Update');
            try {
                setLeaderboard(data as LiveQuizLeaderboardItem[]);
            } catch (e) {
                console.error('[LiveQuiz] Failed to parse leaderboard message', e);
            }
        });
        if (lbSub) subscriptionsRef.current.push(lbSub);

        return () => {
            unsubscribeAll();
        };
    }, [pin, role, isConnected, unsubscribeAll]);


    return {
        isConnected,
        playersList,
        lastPlayerEvent,
        leaderboard,
        disconnect: unsubscribeAll // Use unsubscribeAll as the disconnect method for this hook
    };
};
