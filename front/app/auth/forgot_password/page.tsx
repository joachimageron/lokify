"use client";

import React from "react";
import {Button, Input, Link, Form, addToast} from "@heroui/react";

export default function Page() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");

    if (!email) return;

    // TODO: Implement forgot password logic
    addToast({
      title: "Votre mot de passe à bien été réinitialisé !",
      description: "Nous vous avons envoyé un lien de réinitialisation à votre adresse mail",
      color: "primary"
    });
    setLoading(false);
  };

  // Defining page's content
  return (
    <main className="flex flex-col items-center justify-center py-[105px] px-4 min-h-screen bg-home-img">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col">
          <h1 className="text-large font-medium">Vous avez oublié votre mot de passe ?</h1>
          <p className="text-small text-default-500">Ca peut arriver, pas de problème ! Saisissez ici votre adresse mail et nous vous envoyons un lien pour le réinitialiser.</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input isRequired label="Adresse mail" name="email" placeholder="Entrez votre adresse mail" type="email" variant="bordered"/>
          <Button isLoading={loading} className="w-full" color="primary" type="submit">Recevoir mon lien de réinitialisation</Button>
        </Form>

        <p className="text-center text-small">
          La mémoire vous est revenue ?&nbsp;<br></br>
          <Link href="/auth/signin" size="sm">Je retourne à la page de connexion</Link>
        </p>
      </div>
    </main>
  );
}
