"use client";

import { useAuth } from "../components/providers/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();


  
  useEffect(() => {
    // If user is authenticated, redirect to home page
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Only render children (login/register forms) if user is not authenticated
  return <>{children}</>;
}