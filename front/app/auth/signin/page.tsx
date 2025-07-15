"use client";

import React from "react";
import { Button, Input, Link, Form, Divider, Checkbox, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/providers/AuthProvider";


export default function Page() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user, login, isLoading: authLoading } = useAuth();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setLoading(false);
      return;
    }

    try {
      // Utilise la fonction login du contexte d'authentification
      const loginData = await login({ email, password });
      console.log("Login data:", loginData);

      // Redirection après la connexion réussie
      // router.push("/dashboard"); // ou toute autre page après la connexion
    } catch (error) {
      console.error("Error during sign in:", error);
      // Les toasts d'erreur sont déjà gérés dans le provider
    } finally {
      setLoading(false);
    }
  };

  // Defining page's content
  return (
    <main className="flex flex-col items-center justify-center py-[130px] px-4 min-h-screen bg-home-img">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col">
          <h1 className="text-large font-medium">Connectez-vous à votre compte</h1>
          <p className="text-small text-default-500">pour accéder à la réservation de casiers</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input isRequired label="Adresse mail" name="email" placeholder="Entrez votre adresse mail" type="email" variant="bordered" />
          <Input isRequired label="Mot de passe" name="password" placeholder="Entrez votre mot de passe" type={isVisible ? "text" : "password"} variant="bordered"
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">Se souvenir de moi</Checkbox>
            <Link className="text-blue-500" href="/auth/forgot_password" size="sm">Mot de passe oublié ?</Link>
          </div>
          <Button isLoading={loading} className="w-full" color="primary" type="submit">Je me connecte</Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OU</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button startContent={<Icon icon="flat-color-icons:google" width={24} />} variant="bordered" onPress={() => console.log("Google todo")}>
            Me connecter avec Google
          </Button>
          <Button startContent={<Icon className="text-default-500" icon="fe:github" width={24} />} variant="bordered" onPress={() => console.log("Github todo")}>
            Me connecter avec Github
          </Button>
        </div>
        <p className="text-center text-small">
          Vous n'avez pas encore de compte ?<br></br>
          <Link href="/auth/register" size="sm">Je crée mon compte</Link>
        </p>
      </div>
    </main>
  );
}
