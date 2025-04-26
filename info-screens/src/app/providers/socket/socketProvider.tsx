"use client"

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

// Define context value shape
interface SocketContextValue {
  /**
   * Returns an existing or new Socket instance connected to the given namespace
   */
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
  /** Base URL of the Socket.IO server */
  url: string;
  /** Default socket.io-client options for all namespaces */
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
export function useSocket(namespace: string = '/'): Socket {
  const { getSocket } = useContext(SocketContext);
  const socketRef = useRef<Socket | null>(null);

  // Retrieve or initialize socket
  socketRef.current = getSocket(namespace.startsWith('/') ? namespace : `/${namespace}`);

  useEffect(() => {

    return () => {
      // Remove all listeners added in this component
      socketRef.current?.off();
      // Note: we don't disconnect the socket here to allow shared usage
    };
  }, []);

  if (!socketRef.current) {
    // Should never happen after first render
    throw new Error(`Unable to get socket for namespace ${namespace}`);
  }
  return socketRef.current;
}
