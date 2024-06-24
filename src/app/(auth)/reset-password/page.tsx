"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { changePasswordSchema } from "@/schemas/changePassword.schema";
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

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      token: token,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // submit form
  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    setIsLoading(true);
    try {
      await axios.post<ApiResponse>("/api/v1/user/reset-password", {
        ...values,
      });
      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password.",
        variant: "success",
      });
      router.push("/sign-in");
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ??
        "Error while logging in with email";
      toast({
        title: "Failed to log in with email",
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
        Set up a new password
      </h1>
      <p className="text-sm font-semibold mb-6 text-slate-300">
        Your password must be different from your previous one.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-gray-900"
                    {...field}
                    placeholder="password"
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
              "Update Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
