"use client";

import { useState, FormEvent } from "react";
import React from "react";
import { Button, Input, Link, Form } from "@heroui/react";
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

    if (errorPassword.length > 0) {
      setLoading(false);
      return;
    }

    try {
      await register({
        email,
        password
      });

      router.push("/auth/signin");
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  const errorMessages = () => {
    return (
      <ul>
        {errorPassword.map((error, i) => (
          <li key={i + "dd"}>{error}</li>
        ))}
      </ul>
    )
  }

  if (password.length > 0) {
    if (password.length < 8) {
      errorPassword.push("Password must have 8 characters or more");
    }
    if ((password.match(/[A-Z]/g) || []).length < 1) {
      errorPassword.push("Password must have at least 1 uppercase letter");
    }
    if ((password.match(/[a-z]/gi) || []).length < 1) {
      errorPassword.push("Password must have at least 1 lowercase letter");
    }
    if ((password.match(/[0-9]/gi) || []).length < 1) {
      errorPassword.push("Password must contain at least 1 digit");
    }
    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
      errorPassword.push("Password must contain at least 1 special character");
    }
    if (password !== confirmPassword) {
      errorConfirmPassword = "Passwords don't match";
    }
  }

  return (
    <main className="flex flex-col items-center justify-center py-[105px] px-4 min-h-screen bg-home-img">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col">
          <h1 className="text-large font-medium">Create an account</h1>
          <p className="text-small text-default-500">to use Lockify services</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input isRequired label="E-mail address" name="email" placeholder="Enter your e-mail address" type="email" variant="bordered" value={email} onValueChange={setEmail} />
          <Input value={password} onValueChange={setPassword} isRequired label="Password" name="password" placeholder="Enter your password"
            type={isPasswordVisible ? "text" : "password"} variant="bordered" isInvalid={errorPassword.length > 0} errorMessage={() => errorMessages()}
            endContent={
              <button type="button" onClick={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-closed-linear" />
                ) : (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-bold" />
                )}
              </button>
            }
          />
          <Input
            value={confirmPassword} onValueChange={setConfirmPassword} isRequired label="Confirm password" name="confirmPassword"
            placeholder="Re-enter your password" type={isPasswordVisible ? "text" : "password"} variant="bordered"
            isInvalid={!!errorConfirmPassword} errorMessage={errorConfirmPassword}
            endContent={
              <button type="button" onClick={toggleConfirmPasswordVisibility}>
                {isConfirmPasswordVisible ? (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-closed-linear" />
                ) : (
                  <Icon className="pointer-events-none text-xl text-default-400" icon="solar:eye-bold" />
                )}
              </button>
            }
          />
          <Button isLoading={loading || authLoading} className="w-full" color="primary" type="submit" disabled={errorPassword.length > 0 || !!errorConfirmPassword}>
            Create my account
          </Button>
        </Form>
        <p className="text-center text-small">
          Already have an account ?<br></br>
          <Link href="/auth/signin" size="sm">Login</Link>
        </p>
      </div>
    </main>
  );
}
