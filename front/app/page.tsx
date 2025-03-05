"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { LockClosedIcon, ClockIcon, BellIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 bg-home-img">
    
      <div className="max-w-3xl text-center bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur Lockify !</h1>
        
        <p className="text-gray-700 text-lg mb-8">
          Réservez un casier en ligne en toute simplicité.<br></br>
          Avec Lockify, sécurisez vos affaires sans stress et profitez de votre temps libre !
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-9">
          <li className="flex flex-col items-center">
            <LockClosedIcon className="h-10 w-10 text-blue-500 mb-2" />
            <p className="font-semibold text-gray-800">Sécurisé</p>
            <p className="text-sm text-gray-600">Vos affaires restent en sécurité 24/7.</p>
          </li>
          <li className="flex flex-col items-center">
            <ClockIcon className="h-10 w-10 text-blue-500 mb-2" />
            <p className="font-semibold text-gray-800">Flexible</p>
            <p className="text-sm text-gray-600">Choisissez la taille et réservez pour la durée qui vous convient.</p>
          </li>
          <li className="flex flex-col items-center">
            <BellIcon className="h-10 w-10 text-blue-500 mb-2" />
            <p className="font-semibold text-gray-800">Notifications</p>
            <p className="text-sm text-gray-600">Recevez un rappel avant expiration.</p>
          </li>
        </ul>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg" 
        onPress={()=> router.push('/auth/signin')}>Je réserve mon casier</Button>
      </div>
    </main>
  );
}
