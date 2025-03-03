"use client";

import React from "react";
import {Button, Input, Link, Form} from "@heroui/react";

export default function Page() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // TODO: Implement reset password logic
    setLoading(false);
  };

  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Reset your password</h1>
          <p className="text-small text-default-500">Enter your new password</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="New Password"
            name="password"
            placeholder="Enter your new password"
            type="password"
            variant="bordered"
          />
          <Input
            isRequired
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            type="password"
            variant="bordered"
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button isLoading={loading} className="w-full" color="primary" type="submit">
            Reset Password
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
