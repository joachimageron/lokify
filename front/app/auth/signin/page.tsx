"use client";

import React from "react";
import { Button, Input, Link, Form, Checkbox } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/components/providers/AuthProvider";
import { useRouter } from "next/navigation";


export default function Page() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
      const loginData = await login({ email, password });
      console.log("Login data:", loginData);
      router.push("/lockers/reservation");
    } catch (error) {
      console.error("Error during sign in:", error);
    } finally {
      setLoading(false);
    }
  };

  // Defining page's content
  return (
    <main className="flex flex-col items-center justify-center py-[130px] px-4 min-h-screen bg-home-img">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col">
          <h1 className="text-large font-medium">Log in to your account</h1>
          <p className="text-small text-default-500">to access the locker reservation</p>
        </div>

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input isRequired label="E-mail address" name="email" placeholder="Enter your e-mail address" type="email" variant="bordered" />
          <Input isRequired label="Password" name="password" placeholder="Enter your password" type={isVisible ? "text" : "password"} variant="bordered"
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
            <Checkbox name="remember" size="sm">Remember me</Checkbox>
            <Link className="text-blue-500" href="/auth/forgot_password" size="sm">Forgot your password?</Link>
          </div>
          <Button isLoading={loading} className="w-full" color="primary" type="submit">Login</Button>
        </Form>
        <p className="text-center text-small">
          Don't have an account yet ?<br></br>
          <Link href="/auth/register" size="sm">Create your account</Link>
        </p>
      </div>
    </main>
  );
}
