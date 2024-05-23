"use client";
import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import signInSchema from "@/schemas/signIn.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Login() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values);
  }
  return (
    <>
      <div className="max-w-md w-full p-6">
        <p className="text-sm font-semibold mb-6 text-white text-left">
          Not a member?{" "}
          <span className="text-blue-600 underline">Register</span>
        </p>
        <h1 className="text-2xl font-semibold mb-6 text-white text-left">
          Log in to your Account
        </h1>
        <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 mb-2 lg:mb-0">
            <Button className="w-full flex justify-center items-center gap-2 bg-[#0d6efd] text-sm text-white p-2 rounded-md hover:bg-blue-600">
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
                    <Input placeholder="username" {...field} />
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
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="py-4 px-8 bg-blue-600">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
