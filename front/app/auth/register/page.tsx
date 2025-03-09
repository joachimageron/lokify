"use client";

import React from "react";
import {Button, Input, Link, Form, Divider} from "@heroui/react";
import {Icon} from "@iconify/react";

export default function Page() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const errorPassword: string[] = [];
  let errorConfirmPassword: string | null = null;
  
  const toggleVisibility = () => setIsVisible(!isVisible);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // TODO: Implement registration logic
    setLoading(false);
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
          <Input isRequired label="Adresse mail" name="email" placeholder="Entrez votre adresse mail" type="email" variant="bordered"/>
          <Input value={password} onValueChange={setPassword} isRequired label="Mot de passe" name="password" placeholder="Entrez votre mot de passe"
             type={isVisible ? "text" : "password"} variant="bordered" isInvalid={errorPassword.length > 0} errorMessage={() => errorMessages()}
             endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-closed-linear"/>
                ) : (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-bold"/>
                )}
              </button>
            }
          />
          <Input
            value={confirmPassword} onValueChange={setConfirmPassword} isRequired label="Confirmez le mot de passe" name="confirmPassword"
            placeholder="Entrez à nouveau votre mot de passe" type={isVisible ? "text" : "password"} variant="bordered"
            isInvalid={!!errorConfirmPassword} errorMessage={errorConfirmPassword}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-closed-linear"/>
                ) : (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-bold"/>
                )}
              </button>
            }
          />
          <Button isLoading={loading} className="w-full" color="primary" type="submit">Créer mon compte</Button>
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
