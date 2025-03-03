"use client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

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
