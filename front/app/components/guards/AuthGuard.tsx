"use client";

import { useAuth } from "@/app/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return null;
    }

    return <>{children}</>;
}
