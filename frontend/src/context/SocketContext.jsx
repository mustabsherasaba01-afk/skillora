import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!user) { setSocket(null); return undefined; }
    const connection = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { auth: { token: localStorage.getItem('skillora_token') } });
    setSocket(connection);
    return () => connection.disconnect();
  }, [user]);
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
