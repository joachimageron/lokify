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
  
  const errorMessages = () => {
    return (
      <ul>
        {errorPassword.map((error, i) => (
          <li key={i+"dd"}>{error}</li>
        ))}
      </ul>
    )
  }
  
  if (password.length > 0) {
    if (password.length < 4) {
      errorPassword.push("Password must be 4 characters or more.");
    }
    if ((password.match(/[A-Z]/g) || []).length < 1) {
      errorPassword.push("Password must include at least 1 upper case letter");
    }
    if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
      errorPassword.push("Password must include at least 1 symbol.");
    }
    if (password !== confirmPassword) {
      errorConfirmPassword = "Passwords do not match.";
    }
  }
  
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Create an account</h1>
          <p className="text-small text-default-500">to continue to BypolarMedia</p>
        </div>
        
        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label={"Username"}
            name={"username"}
            placeholder={"Enter your username"}
            type={"text"}
            variant={"bordered"}
          />
          
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            value={password}
            onValueChange={setPassword}
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
            isInvalid={errorPassword.length > 0}
            errorMessage={() => errorMessages()}
          />
          <Input
            value={confirmPassword}
            onValueChange={setConfirmPassword}
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
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            isInvalid={!!errorConfirmPassword}
            errorMessage={errorConfirmPassword}
          />
          {/*<div className="flex w-full items-center justify-between px-1 py-2">*/}
          {/*  <Checkbox name="remember" size="sm">*/}
          {/*    Remember me*/}
          {/*  </Checkbox>*/}
          {/*</div>*/}
          <Button isLoading={loading} className="w-full" color="primary" type="submit">
            Register
          </Button>
        </Form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1"/>
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1"/>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24}/>}
            variant="bordered"
            onPress={() => console.log("Google todo")}
          >
            Continue with Google
          </Button>
          <Button
            startContent={<Icon className="text-default-500" icon="fe:github" width={24}/>}
            variant="bordered"
            onPress={() => console.log("Github todo")}
          >
            Continue with Github
          </Button>
        </div>
        <p className="text-center text-small">
          Already an account ?&nbsp;
          <Link href="/auth/signin" size="sm">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
