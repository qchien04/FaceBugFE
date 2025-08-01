import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import StompWebSocketManager from "../utils/stompWebSocketManager";

interface WebSocketContextType {
  wsManager: StompWebSocketManager;
  isConnected: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null);
interface WebSocketProviderProps {
  children: ReactNode;
  serverUrl: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  serverUrl 
}) => {
  const wsManagerRef = useRef<StompWebSocketManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("Tạo mới ws manager----------------------")
    // Khởi tạo WebSocket Manager
    wsManagerRef.current = new StompWebSocketManager(serverUrl);

    // Lắng nghe connection state changes
    const unsubscribeConnectionState = wsManagerRef.current.onConnectionStateChange(
      (connected) => {
        setIsConnected(connected);
      }
    );

    // Kết nối với token từ localStorage
    const token = localStorage.getItem('jwtToken');
    if (token) {
      wsManagerRef.current.connect(token).catch(error => {
        console.error('Failed to connect WebSocket:', error);
      });
    }

    // Cleanup khi unmount
    return () => {
      unsubscribeConnectionState();
      wsManagerRef.current?.disconnect();
    };
  }, [serverUrl]);

  const value: WebSocketContextType = {
    wsManager: wsManagerRef.current!,
    isConnected
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};