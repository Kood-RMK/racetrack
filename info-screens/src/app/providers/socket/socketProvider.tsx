"use client"

import React, { createContext, useContext, useEffect, useRef, ReactNode, RefObject } from 'react';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

interface SocketContextValue {
  getSocket: (namespace?: string) => Socket;
}

// Create Context with a default stub implementation
const SocketContext = createContext<SocketContextValue>({
  getSocket: () => {
    throw new Error('SocketProvider not found in component tree');
  },
});

// Props for SocketProvider
interface SocketProviderProps {
  url: string;
  options?: Partial<ManagerOptions & SocketOptions>;
  children: ReactNode;
}

/**
 * SocketProvider establishes and caches Socket.IO connections per namespace.
 */
export function SocketProvider({ url, options = {}, children }: SocketProviderProps) {
  // Map to store namespace -> Socket instance
  const socketsRef = useRef<Map<string, Socket>>(new Map());

  /**
   * Lazily get or create a Socket.IO client for a given namespace
   * @param namespace string, e.g. '/chat' or 'notifications' (defaults to '/')
   */
  function getSocket(namespace: string = '/'): Socket {
    const nsKey = namespace.startsWith('/') ? namespace : `/${namespace}`;
    if (!socketsRef.current.has(nsKey)) {
      const socket = io(`${url}${nsKey}`, options);
      console.log(`[📩 Socket]: Socket initialized for namespace: ${namespace}`);
      socketsRef.current.set(nsKey, socket);
    }
    // Non-null assertion is safe because we just set it if missing
    return socketsRef.current.get(nsKey)!;
  }

  // Disconnect all sockets on provider unmount
  useEffect(() => {
    return () => {
      socketsRef.current.forEach((socket) => {
        socket.disconnect();
      });
      socketsRef.current.clear();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ getSocket }}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Hook to access a Socket.IO connection for a given namespace.
 * @param namespace string (defaults to '/')
 * @returns Socket instance
 */
export function useSocket(namespace: string = '/'): RefObject<Socket | null> {
  const { getSocket } = useContext(SocketContext);
  const socketRef = useRef<Socket | null>(null);

  // Retrieve or initialize socket

  useEffect(() => {

    socketRef.current = getSocket(namespace.startsWith('/') ? namespace : `/${namespace}`);
    return () => {
    };
  }, []);

  return socketRef;
}
