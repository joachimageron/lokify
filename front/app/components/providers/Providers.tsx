"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import ReactQueryProvider from "@/app/components/providers/ReactQueryProvider";

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ReactQueryProvider>
      <HeroUIProvider>
        <ToastProvider
          placement="top-center"
          toastOffset={15}
          toastProps={{ variant: "flat" }}
        />
        {children}
      </HeroUIProvider>
    </ReactQueryProvider>
  );
};
