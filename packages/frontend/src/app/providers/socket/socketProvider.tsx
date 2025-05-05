"use client"

import React, { createContext, useContext, useEffect, useRef, ReactNode, RefObject } from 'react';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import { AuthenticationState, useAuthentication } from '../auth/authProvider';

interface SocketContextValue {
  getSocket: (namespace?: string, authState? : AuthenticationState) => Socket;
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

  function getSocket(namespace: string = '/', authState? : AuthenticationState): Socket {

    const nsKey = namespace.startsWith('/') ? namespace : `/${namespace}`;
    if (!socketsRef.current.has(nsKey)) {

      if (authState) {
        options.auth = {
          token: authState.jwt,
        }
      }

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

export function useSocket(namespace: string = '/', secure : boolean = false): RefObject<Socket | null> {
  const { getSocket } = useContext(SocketContext);
  const socketRef = useRef<Socket | null>(null);

  if (secure) {
    const {authState} = useAuthentication();
    useEffect(() => {
    // Retrieve or initialize socket
      socketRef.current = getSocket(namespace.startsWith('/') ? namespace : `/${namespace}`, authState);
      return () => {
      };

    }, [authState]);
  } else {
    useEffect(() => {
    // Retrieve or initialize socket
      socketRef.current = getSocket(namespace.startsWith('/') ? namespace : `/${namespace}`);
      return () => {
      };

    }, []);
  }


  return socketRef;
}
