"use client";

import React from "react";
import {Button, Input, Link, Form, Divider, Checkbox} from "@heroui/react";
import {Icon} from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/utils/config";

export default function Page() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  
  // Create a mutation instead of a query (better for form submissions)
  const mutation = useMutation({
    mutationFn: async (credentials: { email: string, password: string }) => {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error("An error occurred while signing in");
      }
      
      return response.json();
    }
  });
  
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
      // Call the mutation with form data
      const data = await mutation.mutateAsync({ email, password });
      console.log(data);
      
      //TODO Implement sign in logic after successful response
    } catch (error) {
      console.error("Error during sign in:", error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Sign in to your account</h1>
          <p className="text-small text-default-500">to continue to BypolarMedia</p>
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
          <Input
            isRequired
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
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
           <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="/auth/forgot_passord" size="sm">
              Forgot password?
            </Link>
          </div> 
          <Button isLoading={loading} className="w-full" color="primary" type="submit">
            Sign In
          </Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onPress={() => console.log("Google todo")}
          >
            Continue with Google
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
            variant="bordered"
            onPress={() => console.log("Github todo")}
          >
            Continue with Github
          </Button>
        </div>
        <p className="text-center text-small">
          Need to create an account ?&nbsp;
          <Link href="/auth/register" size="sm">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
