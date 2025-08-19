import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from '../lib/axios';

// 1. Define the shape of your context
interface AuthContextType {
  user: any | null;
  loading: boolean;
  fetchUser: () => Promise<void>; // ✅ Expose fetchUser to consumers
}

// 2. Create the actual context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Define props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// 4. AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

const fetchUser = async () => {
  try {
    const { data } = await axios.get('/api/user');
    setUser(data);
  } catch (err: any) {
    if (err.response?.status !== 401) {
      console.error('Error fetching user:', err);
    }
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
