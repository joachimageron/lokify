"use client";

import { useAuth } from "@/app/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";

export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 px-6 bg-white/30 backdrop-blur-md backdrop-saturate-150 z-5">
            <Link href="/" className="block w-fit">
                <Image
                    src="/images/logo.ico"
                    alt="Logo Lockify"
                    title="Retour à l'accueil"
                    className="max-h-[75px] w-auto"
                    width={150}
                    height={50}
                    priority
                />
            </Link>

            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-black">Bonjour {user.email}</span>
                    <Button className="bg-blue-600 text-white" onPress={logout}>
                        Déconnexion
                    </Button>
                </div>
            )}
        </header>
    );
}
