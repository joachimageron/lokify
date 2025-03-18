"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
} from '@tanstack/react-query';
import { API_URL } from "@/utils/config";
import { addToast } from '@heroui/react';

type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isError: boolean;
  login: (credentials: { email: string, password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { email: string, password: string }) => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clé pour la requête d'authentification
const USER_QUERY_KEY = ['auth', 'user'];

// Supposons que cette fonction est importée ou fournie dans le composant parent
interface ToastProps {
  title: string;
  description: string;
  color: string;
}

export const AuthProvider = ({ children}: { 
  children: React.ReactNode, 
}) => {
  const queryClient = useQueryClient();

  // Requête pour vérifier l'auth et récupérer les données utilisateur
  const { 
    data: user,
    isLoading,
    isError,
    refetch 
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        // Si l'API retourne 401, ce n'est pas une erreur mais un état non authentifié
        if (response.status === 401) {
          return null;
        }
        throw new Error('Failed to fetch user');
      }
      
      return response.json();
    },
    // Désactiver le retry automatique pour les erreurs d'authentification
    retry: (failureCount, error: any) => {
      // Si l'erreur est 401, ne pas réessayer
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    // Mise en cache et stratégie de rafraîchissement
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Gérer les erreurs d'authentification
  useEffect(() => {
    if (isError) {
      addToast({
        title: "Authentication Error",
        description: "Failed to check authentication status",
        color: "danger"
      });
    }
  }, [isError]);

  // Créer une fonction wrapper qui retourne Promise<void>
  const refetchUser = async (): Promise<void> => {
    try {
      await refetch();
    } catch (error) {
      addToast({
        title: "Refresh Error",
        description: "Failed to refresh user information",
        color: "danger"
      });
    }
    return;
  };

  // Mutation pour s'inscrire
  const registerMutation = useMutation({
    mutationFn: async (userData: { email: string, password: string }) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: () => {
      // Rafraîchir les données utilisateur après inscription réussie
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      addToast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        color: "success"
      });
      
    },
    onError: (error) => {
      addToast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        color: "danger"
      });
    },
  });

  // Mutation pour se connecter
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string, password: string }) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      return response.json();
    },
    onSuccess: () => {
      // Rafraîchir les données utilisateur après connexion réussie
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      addToast({
        title: "Login Successful",
        description: "You have been successfully logged in",
        color: "success"
      });
    },
    onError: (error) => {
      addToast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        color: "danger"
      });
    },
  });

  // Mutation pour se déconnecter
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return response.json();
    },
    onSuccess: () => {
      // Réinitialiser les données utilisateur après déconnexion
      queryClient.setQueryData(USER_QUERY_KEY, null);
      // Invalider potentiellement d'autres requêtes qui dépendent de l'authentification
      queryClient.invalidateQueries();
      addToast({
        title: "Logout Successful",
        description: "You have been successfully logged out",
        color: "success"
      });
    },
    onError: (error) => {
      addToast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout",
        color: "danger"
      });
    }
  });

  const login = async (credentials: { email: string, password: string }) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const register = async (userData: {email: string, password: string }) => {
    return registerMutation.mutateAsync(userData);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isError, 
        login, 
        logout,
        register,
        refetchUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};