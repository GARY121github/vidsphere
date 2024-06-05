"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import signUpSchema from "@/schemas/signUp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";

export default function SignUpPage() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
    },
  });

  const [availableUsername, setAvailableUsername] = useState("");
  const [availableUsernameMessage, setAvailableUsernameMessage] = useState("");
  const [isCheckingAvailableUsername, setIsCheckingAvailableUsername] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const debounce = useDebounceCallback(setAvailableUsername, 500);

  // api call to check if username is available or not
  async function checkAvailableUsername() {
    if (availableUsername.trim().length > 0) {
      setIsCheckingAvailableUsername(true);
      setAvailableUsernameMessage("");
      try {
        const response = await axios.post<ApiResponse>(
          "/api/v1/user/check-unique-username",
          { username: availableUsername }
        );
        setAvailableUsernameMessage(response.data.message);
      } catch (error: any) {
        const axiosError = error as AxiosError<ApiError>;
        const errorMessage =
          axiosError?.response?.data?.message ??
          "Error while getting available username";
        setAvailableUsernameMessage(errorMessage);
      } finally {
        setIsCheckingAvailableUsername(false);
      }
    }
  }

  // optimize the api call to check if username is available or not
  useEffect(() => {
    checkAvailableUsername();
  }, [availableUsername]);

  // submit the form
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      await axios.post<ApiResponse>("/api/v1/user/signup", values);
      toast({
        title: "Signup Success",
        description: "You have successfully signed up",
        variant: "success",
      });
      router.replace(`/verify/${values.username.toLocaleLowerCase()}`);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while signing up";
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-md w-full p-6">
        <p className="text-sm font-semibold mb-6 text-white text-left">
          Already a member?{" "}
          <Link href={"/sign-in"} className="text-blue-600 underline">
            Login
          </Link>
        </p>
        <h1 className="text-2xl font-semibold mb-6 text-white text-left">
          Register your Account
        </h1>
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
                      className="bg-gray-900"
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounce(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingAvailableUsername && (
                    <Loader2 className="animate-spin" />
                  )}
                  <p
                    className={`text-sm ${availableUsernameMessage === "Username is avaliable" ? "text-green-500" : "text-red-500"}`}
                  >
                    {availableUsernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-900"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FullName</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-900"
                      placeholder="Enter your fullname"
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
                      className="bg-gray-900"
                      type="password"
                      placeholder="Enter your password"
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
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
