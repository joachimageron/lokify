"use client";

import React, { createContext, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { API_URL } from "@/utils/config";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isError: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string }) => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_QUERY_KEY = ["auth", "user"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) return null;
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isError) {
      addToast({
        title: "Authentication Error",
        description: "Failed to check authentication status",
        color: "danger",
      });
    }
  }, [isError]);

  const refetchUser = async (): Promise<void> => {
    try {
      await refetch();
    } catch {
      addToast({
        title: "Refresh Error",
        description: "Failed to refresh user information",
        color: "danger",
      });
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      addToast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        color: "danger",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      addToast({
        title: "Login Successful",
        description: "You have been successfully logged in",
        color: "success",
      });
      router.push("/lockers/reservation");
    },
    onError: (error) => {
      addToast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        color: "danger",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);
      queryClient.invalidateQueries();
      addToast({
        title: "Logout Successful",
        description: "You have been successfully logged out",
        color: "success",
      });
      router.push("/");
    },
    onError: (error) => {
      addToast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout",
        color: "danger",
      });
    },
  });

  const login = async (credentials: { email: string; password: string }) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const register = async (userData: { email: string; password: string }) => {
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
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
