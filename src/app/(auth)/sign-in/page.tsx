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
import { Loader2 } from "lucide-react";
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

      router.replace("/");
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
                    <Input
                      placeholder="password"
                      type="password"
                      className="text-black"
                      {...field}
                    />
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
