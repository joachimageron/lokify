"use client";

import { useState, FormEvent } from "react";
import React from "react";
import { Button, Input, Link, Form, Divider, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/providers/AuthProvider";

export default function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuth();
  
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const errorPassword: string[] = [];
  let errorConfirmPassword: string | null = null;
  
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      return;
    }

    // Vérifiez que le mot de passe est suffisamment fort
    if (errorPassword.length > 0) {
      setLoading(false);
      return;
    }

    try {
      await register({
        email,
        password
      });

      // Redirection après l'inscription réussie
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error during registration:", error);
      // Les toasts d'erreur sont déjà gérés dans le provider
    } finally {
      setLoading(false);
    }
  };


  // Defining password's error messages structure
  const errorMessages = () => {
    return (
      <ul>
        {errorPassword.map((error, i) => (
          <li key={i+"dd"}>{error}</li>
        ))}
      </ul>
    )
  }

  // Defining password's error custom messages
  if (password.length > 0) {
    if (password.length < 8) {
      errorPassword.push("Le mot de passe doit être constitué de 8 caractères ou plus");
    }
    if ((password.match(/[A-Z]/g) || []).length < 1) {
      errorPassword.push("Le mot de passe doit posséder au moins 1 majuscule");
    }
    if ((password.match(/[a-z]/gi) || []).length < 1) {
      errorPassword.push("Le mot de passe doit posséder au moins 1 minuscule");
    }
    if ((password.match(/[0-9]/gi) || []).length < 1) {
      errorPassword.push("Le mot de passe doit posséder au moins 1 chiffre");
    }
    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
      errorPassword.push("Le mot de passe doit posséder au moins 1 caractère spécial");
    }
    if (password !== confirmPassword) {
      errorConfirmPassword = "Les mots de passe ne correspondent pas";
    }
  }

  // Defining page's content
  return (
    <main className="flex flex-col items-center justify-center py-[105px] px-4 min-h-screen bg-home-img">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col">
          <h1 className="text-large font-medium">Créez-vous un compte</h1>
          <p className="text-small text-default-500">pour utiliser les services de Lockify</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input isRequired label="Adresse mail" name="email" placeholder="Entrez votre adresse mail" type="email" variant="bordered" value={email} onValueChange={setEmail}/>
          <Input value={password} onValueChange={setPassword} isRequired label="Mot de passe" name="password" placeholder="Entrez votre mot de passe"
             type={isPasswordVisible ? "text" : "password"} variant="bordered" isInvalid={errorPassword.length > 0} errorMessage={() => errorMessages()}
             endContent={
              <button type="button" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-closed-linear"/>
                ) : (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-bold"/>
                )}
              </button>
            }
          />
          <Input
            value={confirmPassword} onValueChange={setConfirmPassword} isRequired label="Confirmez le mot de passe" name="confirmPassword"
            placeholder="Entrez à nouveau votre mot de passe" type={isPasswordVisible ? "text" : "password"} variant="bordered"
            isInvalid={!!errorConfirmPassword} errorMessage={errorConfirmPassword}
            endContent={
              <button type="button" onClick={toggleConfirmPasswordVisibility}>
                {isConfirmPasswordVisible ? (
                    <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-closed-linear"/>
                ) : (
                    <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-bold"/>
                )}
              </button>
            }
          />
          <Button isLoading={loading  || authLoading} className="w-full" color="primary" type="submit"  disabled={errorPassword.length > 0 || !!errorConfirmPassword}>
              Créer mon compte
          </Button>
        </Form>
          {/* <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1"/>
            <p className="shrink-0 text-tiny text-default-500">OU</p>
          <Divider className="flex-1"/>
        </div>
        <div className="flex flex-col gap-2">
          <Button startContent={<Icon icon="flat-color-icons:google" width={24}/>} variant="bordered" onPress={() => console.log("Google todo")}>
            Me connecter avec Google
          </Button>
          <Button startContent={<Icon className="text-default-500" icon="fe:github" width={24}/>} variant="bordered" onPress={() => console.log("Github todo")}>
            Me connecter avec Github
          </Button>
        </div> */}
        <p className="text-center text-small">
          Vous avez déja un compte ?<br></br>
          <Link href="/auth/signin" size="sm">Je me connecte</Link>
        </p>
      </div>
    </main>
  );
}
