"use client";
import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import signInSchema from "@/schemas/signIn.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Importing the icons
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    const response = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });

      if (response?.error === "Please verify your email first") {
        router.push(`/verify/${values.username.toLocaleLowerCase()}`);
      }
    }

    if (response?.url) {
      toast({
        title: "Success",
        description: "You have successfully signed in",
      });

      router.replace("/home");
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="max-w-md w-full p-6">
        <p className="text-sm font-semibold mb-6 text-white text-left">
          Not a member?{" "}
          <Link href="/sign-up">
            <span className="text-blue-600 underline">Register</span>
          </Link>
        </p>
        <h1 className="text-2xl font-semibold mb-6 text-white text-left">
          Log in to your Account
        </h1>
        <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 mb-2 lg:mb-0">
            <Button
              className="w-full flex justify-center items-center gap-2 bg-[#0d6efd] text-sm text-white p-2 rounded-md hover:bg-blue-600"
              onClick={() => signIn("google")}
            >
              <Image width={25} height={25} src="/google.svg" alt="google" />
              Sign in with Google
            </Button>
          </div>
        </div>
        <div className="flex items-center my-4">
          <hr className="w-1/12 border-gray-500" />
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <hr className="flex-grow border-gray-500" />
        </div>

        {/* Demo Credentials Section */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <h3 className="text-sm font-medium text-white mb-2">
            Demo Credentials
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Click below to use demo credentials for testing
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            onClick={() => {
              form.setValue("username", "falgun");
              form.setValue("password", "Vidsphere@12");
            }}
          >
            Use Demo Credentials
          </Button>
          <div className="mt-2 text-xs text-gray-500">
            <p>
              Username: <span className="text-gray-300">falgun</span>
            </p>
            <p>
              Password: <span className="text-gray-300">Vidsphere@12</span>
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      className="text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="text-black"
                        type={showPassword ? "text" : "password"} // Toggle input type
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-0 p-2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="py-4 px-8 bg-blue-600 hover:bg-blue-700 w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Link href="/forgot-password" className="block text-center">
              <span className="text-blue-600 underline">forgot password</span>
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}
