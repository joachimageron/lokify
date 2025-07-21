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
          <h1 className="text-large font-medium">Forgot your password ?</h1>
          <p className="text-small text-default-500">It can happen, no problem! Enter your
            e-mail address here and we'll send you a link to reset it.</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input isRequired label="E-mail address" name="email" placeholder="Enter your e-mail address"
            type="email" variant="bordered" disabled={forgotPasswordMutation.isPending} />
          <Button isLoading={forgotPasswordMutation.isPending} className="w-full" color="primary" type="submit">Receive my reset link</Button>
        </Form>

        <p className="text-center text-small">
          Has your memory returned ?&nbsp;<br></br>
          <Link href="/auth/signin" size="sm">I return to the login page</Link>
        </p>
      </div>
    </main>
  );
}
