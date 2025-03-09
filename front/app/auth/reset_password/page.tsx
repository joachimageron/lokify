"use client";

import React from "react";
import {Button, Input, Form} from "@heroui/react";
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

    const data = new FormData(event.currentTarget);
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
          <h1 className="text-large font-medium">Choisissez votre nouveau mot de passe</h1>
          <p className="text-small text-default-500">qu'il faudra désormais utiliser pour vous connecter à votre compte.</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
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
          <Button isLoading={loading} className="w-full" color="primary" type="submit">Valider ce nouveau mot de passe</Button>
        </Form>
      </div>
    </main>
  );
}
