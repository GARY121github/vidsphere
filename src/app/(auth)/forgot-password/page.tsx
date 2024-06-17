"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { forgotPasswordSchema } from "@/schemas/forgotPassword.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // submit the form
  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/v1/email/forgot-password",
        values
      );
      toast({
        title: "checkout your email",
        description:
          "We have sent you an email with instructions to reset your password.",
        variant: "success",
      });
      console.log(response);
      router.push("/sign-in");
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ??
        "Error while sending instruction";
      toast({
        title: "Failed to send instructions",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full p-6">
      <h1 className="text-2xl font-semibold mb-6 text-white text-left">
        Forgot Password
      </h1>
      <p className="text-sm font-semibold mb-6 text-slate-300">
        Include the email address associated with your account and we’ll send
        you an email with instructions to reset your password.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-900"
                    {...field}
                    placeholder="Email"
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
              "send reset instructions"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
