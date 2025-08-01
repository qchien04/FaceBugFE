import Stomp from 'stompjs';

export interface StompMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface NotificationMessage {
  id: string;
  type: 'FRIEND_REQUEST' | 'LIKE' | 'COMMENT' | 'MENTION' | 'SYSTEM';
  title: string;
  content: string;
  userId: number;
  timestamp: number;
  read: boolean;
  data?: any;
}
class StompWebSocketManager {
  private stompClient: Stomp    .Client | null = null;
  private isConnected: boolean = false;
  private subscriptions: Map<string, Stomp.Subscription> = new Map();
  private messageHandlers: Map<string, Set<(message: any) => void>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionStateCallbacks: Set<(connected: boolean) => void> = new Set();

  constructor(private serverUrl: string) {}

  // Kết nối với authentication
  connect(token: string): Promise<void> {
    console.log("new connect-----------------------")
    return new Promise((resolve, reject) => {
      try {
        const socket = new WebSocket(this.serverUrl);
        this.stompClient = Stomp.over(socket);

        // Tắt debug logs nếu không cần
        // this.stompClient.debug = (str) => {
        //   console.log('STOMP: ' + str);
        // };
        this.stompClient.debug = () => {};
        this.stompClient.connect(
          {
            Authorization: `Bearer ${token}`
          },
          () => {
            console.log('STOMP WebSocket connected successfully');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.notifyConnectionStateChange(true);
            
            // Subscribe lại tất cả channels đã đăng ký trước đó
            this.resubscribeAllChannels();
            resolve();
          },
          (error) => {
            console.error('STOMP connection error:', error);
            this.isConnected = false;
            this.notifyConnectionStateChange(false);
            this.handleReconnect(token);
            reject(error);
          }
        );
      } catch (error) {
        console.error('Failed to create STOMP connection:', error);
        reject(error);
      }
    });
  }

  // Xử lý reconnect
  private handleReconnect(token: string) {
    console.log("reconnect-----------------------")
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect(token).catch(() => {
          // Sẽ tự động retry lại nếu fail
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Subscribe vào một destination
  subscribe(destination: string, handler: (message: any) => void): () => void {
    console.log("subscribe -----------------------")
    // Thêm handler vào danh sách
    if (!this.messageHandlers.has(destination)) {
      this.messageHandlers.set(destination, new Set());
    }
    this.messageHandlers.get(destination)!.add(handler);

    // Thực hiện subscribe nếu đã connected
    if (this.isConnected && this.stompClient?.connected) {
      this.performSubscription(destination);
    }

    // Return unsubscribe function
    return () => {
      console.log("unsubscribe -----------------------")
      const handlers = this.messageHandlers.get(destination);
      if (handlers) {
        handlers.delete(handler);
        
        // Nếu không còn handler nào, unsubscribe
        if (handlers.size === 0) {
          this.unsubscribe(destination);
        }
      }
    };
  }

  // Thực hiện subscribe thực tế
  private performSubscription(destination: string) {
    console.log("performSubscription -----------------------")
    if (!this.subscriptions.has(destination) && this.stompClient?.connected) {
      try {
        const subscription = this.stompClient.subscribe(destination, (message) => {
          this.handleMessage(destination, message);
        });
        
        this.subscriptions.set(destination, subscription);
        console.log(`Subscribed to ${destination}`);
      } catch (error) {
        console.error(`Failed to subscribe to ${destination}:`, error);
      }
    }
  }

  // Xử lý tin nhắn nhận được
  private handleMessage(destination: string, stompMessage: Stomp.Message) {
    const handlers = this.messageHandlers.get(destination);
    if (handlers) {
      try {
        const parsedMessage = JSON.parse(stompMessage.body);
        handlers.forEach(handler => {
          try {
            console.log(parsedMessage);
            handler(parsedMessage);
          } catch (error) {
            console.error(`Error in message handler for ${destination}:`, error);
            console.log(parsedMessage)
          }
        });
      } catch (error) {
        console.error(`Failed to parse message for ${destination}:`, error);
      }
    }
  }

  // Unsubscribe từ destination
  private unsubscribe(destination: string) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      this.messageHandlers.delete(destination);
      console.log(`Unsubscribed from ${destination}`);
    }
  }

  // Subscribe lại tất cả channels khi reconnect
  private resubscribeAllChannels() {
    this.messageHandlers.forEach((_, destination) => {
      this.performSubscription(destination);
    });
  }

  // Gửi tin nhắn
  send(destination: string, body: any, headers: any = {}) {
    if (this.isConnected && this.stompClient?.connected) {
      try {
        this.stompClient.send(destination, headers, JSON.stringify(body));
      } catch (error) {
        console.error(`Failed to send message to ${destination}:`, error);
      }
    } else {
      console.warn('STOMP client is not connected. Cannot send message.');
    }
  }

  // Đăng ký callback cho connection state changes
  onConnectionStateChange(callback: (connected: boolean) => void): () => void {
    this.connectionStateCallbacks.add(callback);
    
    // Gọi ngay với trạng thái hiện tại
    callback(this.isConnected);
    
    return () => {
      this.connectionStateCallbacks.delete(callback);
    };
  }

  private notifyConnectionStateChange(connected: boolean) {
    this.connectionStateCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection state callback:', error);
      }
    });
  }

  // Disconnect
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Unsubscribe tất cả
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    
    this.subscriptions.clear();
    this.messageHandlers.clear();

    if (this.stompClient?.connected) {
      this.stompClient.disconnect(() => {
        console.log('STOMP WebSocket disconnected');
      });
    }

    this.isConnected = false;
    this.notifyConnectionStateChange(false);
  }

  // Getters
  get connected(): boolean {
    return this.isConnected && this.stompClient?.connected === true;
  }

  get client(): Stomp.Client | null {
    return this.stompClient;
  }
}

export default StompWebSocketManager;