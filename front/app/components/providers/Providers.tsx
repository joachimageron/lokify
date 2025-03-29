"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import ReactQueryProvider from "@/app/components/providers/ReactQueryProvider";
import { AuthProvider } from "@/app/components/providers/AuthProvider";

// Defining providers to enable all pages to use notifications (toast)
export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <HeroUIProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <ToastProvider
            placement="top-center"
            toastOffset={15}
            toastProps={{ variant: "flat" }}
          />
          {children}
        </AuthProvider>
      </ReactQueryProvider>
    </HeroUIProvider>
  );
};
