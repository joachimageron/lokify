"use client";

import React from "react";
import {Button, Input, Link, Form} from "@heroui/react";

export default function Page() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");

    if (!email) return;

    // TODO: Implement forgot password logic
    setLoading(false);
  };

  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Forgot your password?</h1>
          <p className="text-small text-default-500">Enter your email to reset it</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Button isLoading={loading} className="w-full" color="primary" type="submit">
            Send Reset Link
          </Button>
        </Form>

        <p className="text-center text-small">
          Changed your mind?&nbsp;
          <Link href="/auth/login" size="sm">
            Go back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
