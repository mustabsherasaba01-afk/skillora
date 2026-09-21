import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMe, loginUser, logoutUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMe().then(({ data }) => setUser(data.data.user)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const login = async (credentials) => { const { data } = await loginUser(credentials); setUser(data.data.user); localStorage.setItem('skillora_token', data.data.token); toast.success('Welcome back'); return data.data.user; };
  const register = async (details) => { const { data } = await registerUser(details); setUser(data.data.user); localStorage.setItem('skillora_token', data.data.token); toast.success('Your Skillora account is ready'); return data.data.user; };
  const logout = async () => { try { await logoutUser(); } catch {} setUser(null); localStorage.removeItem('skillora_token'); toast.success('Signed out'); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
