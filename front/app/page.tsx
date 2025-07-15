"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/providers/AuthProvider";
import { LockClosedIcon, ClockIcon, BellIcon } from "@heroicons/react/24/solid";

// Defining the Lockify's features (displayed in page's content)
const features = [
  { icon: LockClosedIcon, title: "Sécurisé", description: "Vos affaires restent en sécurité 24/7." },
  { icon: ClockIcon, title: "Flexible", description: "Choisissez la taille et réservez pour la durée qui vous convient." },
  { icon: BellIcon, title: "Notifications", description: "Recevez un rappel avant expiration." },
];

// Defining the home page's content
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-[105px] min-h-screen bg-home-img">

      <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur Lockify !</h1>

        <p className="text-gray-700 text-lg mb-8">
          Réservez un casier en ligne en toute simplicité.<br></br>
          Avec Lockify, sécurisez vos affaires sans stress et profitez de votre temps libre !
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-9">
          {features.map((feature, index) => (
            <li key={index} className="flex flex-col items-center">
              <feature.icon className="h-10 w-10 text-blue-500 mb-2" />
              <p className="font-semibold text-gray-800">{feature.title}</p>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </li>
          ))}
        </ul>

        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg">
          <Link href={user ? "/lockers/reservation" : "/auth/signin"}>
            Je réserve mon casier
          </Link>
        </Button>
      </div>
    </main>
  );
}
