"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

// Defining providers to enable all pages to use notifications (toast)
export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <HeroUIProvider>
      <ToastProvider
        placement="top-center"
        toastOffset={15}
        toastProps={{ variant: "flat" }}
      />
      {children}
    </HeroUIProvider>
  );
};
