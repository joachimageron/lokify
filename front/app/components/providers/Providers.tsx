"use client";
import { HeroUIProvider } from "@heroui/react";

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
  <HeroUIProvider>
    {children}
    </HeroUIProvider>
    );
};
