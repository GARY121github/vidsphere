"use client";

import React, { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { verifyCodeSchema } from "@/schemas/verifyCode.schema";
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
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import signUpSchema from "@/schemas/signUp.schema";

export default function Verify({ params }: { params: { username: string } }) {
  const { username } = params;
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      username: username,
      code: "",
    },
  });

  const [reSendCodeLoading, setReSendCodeLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // submit the form
  async function onSubmit(values: z.infer<typeof verifyCodeSchema>) {
    setIsLoading(true);
    try {
      console.log("values is", values);
      const response = await axios.post<ApiResponse>(
        "/api/v1/user/verify-code",
        { username: values.username, code: values.code }
      );
      console.log("response is", response);
      toast({
        title: "Verify success",
        description: "you are successfully verified",
        variant: "success",
      });
      router.replace("/sign-in");
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while verifying";
      toast({
        title: "verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // resend verfication code
  async function resendCode() {
    setReSendCodeLoading(true);
    setTimeout(() => {
      setReSendCodeLoading(false);
    }, 3000);
  }
  return (
    <>
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-semibold mb-6 text-white text-left">
          Verify your Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-900"
                      {...field}
                      value={username}
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>verfication code</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-900"
                      placeholder="VerficationCode"
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
                "verify code"
              )}
            </Button>
          </form>
        </Form>
        <Button
          onClick={() => resendCode()}
          disabled={reSendCodeLoading}
          className="py-4 px-8 bg-blue-600 hover:bg-blue-700 w-full mt-4"
        >
          {reSendCodeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
            </>
          ) : (
            "resend verification code"
          )}
        </Button>
      </div>
    </>
  );
}
