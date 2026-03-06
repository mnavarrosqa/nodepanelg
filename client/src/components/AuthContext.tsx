import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setupNeeded: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkSetupStatus: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [setupNeeded, setSetupNeeded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    checkSetupStatus().finally(() => setLoading(false));
  }, []);

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setSetupNeeded(data.setupNeeded);
    } catch (error) {
      console.error('Failed to check setup status', error);
    }
  };

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    setSetupNeeded(false);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, setupNeeded, login, logout, checkSetupStatus, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
