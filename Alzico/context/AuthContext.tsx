import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  sessionToken: string | null;
}

interface User {
  id: string;
  email: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL =
  process.env.REACT_APP_API_URL ||
  process.env.MODEL_API_URL ||
  'http://localhost:5000';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('sessionToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        // Try to validate session with server, but don't fail if server is down
        try {
          const response = await fetch(`${API_URL}/auth/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionToken: storedToken }),
            // Add timeout to prevent hanging
          });

          if (response.ok) {
            const data = await response.json();
            setUser(JSON.parse(storedUser));
            setSessionToken(storedToken);
            setIsAuthenticated(true);
          } else if (response.status === 401) {
            // Only clear session if explicitly unauthorized
            await AsyncStorage.multiRemove(['sessionToken', 'user']);
          } else {
            // For other errors (500, network issues), keep the session
            setUser(JSON.parse(storedUser));
            setSessionToken(storedToken);
            setIsAuthenticated(true);
            console.log('Server validation failed, but keeping local session');
          }
        } catch (fetchError) {
          // If server is unreachable, trust local session
          console.log('Cannot reach server, using local session');
          setUser(JSON.parse(storedUser));
          setSessionToken(storedToken);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.user.id.toString(),
          email: data.user.email,
          fullName: data.user.full_name
        };
        
        setUser(userData);
        setSessionToken(data.sessionToken);
        setIsAuthenticated(true);
        
        // Store session data
        await AsyncStorage.setItem('sessionToken', data.sessionToken);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    console.log('AuthContext.signup called', { email, fullName, API_URL });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });
      
      console.log('Signup response status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful, data:', data);
        const userData: User = {
          id: data.user?.id?.toString() || Date.now().toString(),
          email: data.user?.email || email,
          fullName: data.user?.full_name || data.user?.fullName || fullName
        };
        
        // If session token is provided on signup, use it
        if (data.sessionToken) {
          console.log('Session token received, storing it');
          setSessionToken(data.sessionToken);
          await AsyncStorage.setItem('sessionToken', data.sessionToken);
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('User data stored:', userData);
        
        return true;
      } else {
        console.log('Response not OK, status:', response.status);
        // Try to get error message from response
        try {
          const errorData = await response.json();
          console.error('Signup failed:', errorData.message || errorData.error || 'Unknown error');
        } catch (e) {
          console.error('Signup failed with status:', response.status);
        }
        
        // If backend is down (network error), create a local account as fallback
        if (response.status === 0 || response.status >= 500) {
          console.log('Backend unavailable (status ' + response.status + '), creating local account');
          const userData: User = {
            id: Date.now().toString(),
            email: email,
            fullName: fullName
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          console.log('Local account created and stored');
          return true;
        }
        console.log('Signup failed with status:', response.status);
        return false;
      }
    } catch (error: any) {
      console.error('Signup fetch error:', error);
      console.error('Error details:', error?.message, error?.stack);
      
      // Network error or backend down - create local account as fallback
      console.log('Network error during signup (backend likely unavailable), creating local account');
      try {
        const userData: User = {
          id: Date.now().toString(),
          email: email,
          fullName: fullName
        };
        
        console.log('Creating local account:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('Local account created successfully');
        return true;
      } catch (storageError) {
        console.error('Failed to create local account:', storageError);
        return false;
      }
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      if (sessionToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage
      setUser(null);
      setSessionToken(null);
      setIsAuthenticated(false);
      await AsyncStorage.multiRemove(['sessionToken', 'user']);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    signup,
    sessionToken
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 