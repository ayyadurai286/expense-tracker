
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, subscribeToAuthChanges } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  isConfigError: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  isLoading: true,
  isConfigError: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigError, setIsConfigError] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      unsubscribe = subscribeToAuthChanges((user) => {
        setCurrentUser(user);
        setIsLoading(false);
        
        if (user) {
          toast.success(`Welcome back, ${user.displayName || user.email}`);
        }
      });
    } catch (error) {
      console.error("Firebase auth error:", error);
      setIsConfigError(true);
      setIsLoading(false);
      
      if (error instanceof Error && error.message.includes('auth/invalid-api-key')) {
        toast.error("Firebase configuration error. Please check your API keys.");
      }
    }

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    isLoading,
    isConfigError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
