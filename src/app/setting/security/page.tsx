"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
import { changePasswordSchema } from "@/schemas/changePassword.schema";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import ApiError from "@/utils/ApiError";

// Define the type for the showPassword state
type ShowPasswordState = {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

export default function AccountSecurity() {
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Toggle password visibility for a specific field
  const togglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Define the form with the changePasswordSchema using Zod for validation
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    setIsLoading(true);
    try {
      await axios.put("/api/v1/user/change-password", {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast({
        title: "Password Changed Successfully",
      });
      form.reset();
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while signing up";
      toast({
        variant: "destructive",
        title: "Error while changing the password",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-3xl font-semibold">Change Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword.currentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="text-black"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    className="absolute right-2 top-0 p-2"
                  >
                    {showPassword.currentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Enter your current password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="text-black"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-2 top-0 p-2"
                  >
                    {showPassword.newPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Enter your new password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="text-black"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-2 top-0 p-2"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Re-enter your new password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> please wait
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
