"use client";

import React from "react";
import { Button, Input, Link, Form, addToast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/utils/config";

// Function to call the forgot password API
const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send reset link");
  }

  return response.json();
};

export default function Page() {
  const [loading, setLoading] = React.useState(false);

  // Use React Query mutation for state management
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      addToast({
        title: "Password reset",
        description: "If your email exists in our system, a reset link has been sent.",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to send reset link",
        color: "danger",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;

    if (!email) {
      addToast({
        title: "Error",
        description: "Please enter your email address",
        color: "danger",
      });
      return;
    }

    setLoading(false);

    // Trigger the mutation
    forgotPasswordMutation.mutate(email);
  };

  return (
      <main className="flex flex-col items-center justify-center py-[105px] px-4 min-h-screen bg-home-img">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
              <div className="flex flex-col">
                  <h1 className="text-large font-medium">Vous avez oublié votre mot de passe ?</h1>
                  <p className="text-small text-default-500">Ca peut arriver, pas de problème ! Saisissez ici votre
                      adresse mail et nous vous envoyons un lien pour le réinitialiser.</p>
              </div>

              <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
                  <Input isRequired label="Adresse mail" name="email" placeholder="Entrez votre adresse mail"
                         type="email" variant="bordered" disabled={forgotPasswordMutation.isPending}/>
                  <Button isLoading={forgotPasswordMutation.isPending} className="w-full" color="primary" type="submit">Recevoir
                      mon lien de réinitialisation</Button>
              </Form>

              <p className="text-center text-small">
                  La mémoire vous est revenue ?&nbsp;<br></br>
                  <Link href="/auth/signin" size="sm">Je retourne à la page de connexion</Link>
              </p>
          </div>
      </main>
  );
}
