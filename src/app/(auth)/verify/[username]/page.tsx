"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import verifyCodeSchema from "@/schemas/verifyCode.schema";
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

export default function VerifyPage({
  params,
}: {
  params: { username: string };
}) {
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

  const [seconds, setSeconds] = useState(15);

  const { toast } = useToast();
  const router = useRouter();

  // let timer;

  // useEffect(()=>{
  //   if(seconds > 0){
  //     timer = setTimeout(() => setSeconds(seconds - 1), 1000);
  //   }else{
  //     setSeconds(0);
  //     setReSendCodeLoading(false);
  //   }

  // },)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setReSendCodeLoading(false);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  // submit the form
  async function onSubmit(values: z.infer<typeof verifyCodeSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/v1/user/verify-code",
        { username: values.username, code: values.code }
      );
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
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // resend verfication code
  async function resendCode() {
    console.log("resend code");
    setReSendCodeLoading(true);
    setSeconds(15); // Reset timer to 30 seconds
    console.log(reSendCodeLoading);
    try {
      await axios.post<ApiResponse>("/api/v1/email/resend-verification-code", {
        username,
      });
      toast({
        title: "check your email",
        description: "verification code sent successfully",
        variant: "success",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ??
        "Error while sending verification code";
      toast({
        title: "Failed to resend verification code",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setReSendCodeLoading(false);
      }, 30000);
    }
  }
  return (
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
            {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait */}
            {`Request new otp in ${seconds} seconds`}
          </>
        ) : (
          "resend verification code"
        )}
      </Button>
    </div>
  );
}
