"use client";
import Modal from "@/components/modal";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import avatarSchema from "@/schemas/avatar.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import axios, { AxiosError } from "axios";

export default function ChangeAvatar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      avatar: null,
    },
  });

  async function onSubmit(values: z.infer<typeof avatarSchema>) {
    if (values.avatar === null) {
      console.log("No file selected");
      return;
    }
    setIsLoading(true);
    try {
      // get the presigned url from server
      const preSignedUrl = await axios.get<ApiResponse>("api/v1/user/avatar");
      const { url } = preSignedUrl.data.data;

      console.log(url);

      // upload the file to aws s3 bucket
      await axios.put(url, values.avatar, {
        headers: {
          "Content-Type": values.avatar.type,
        },
      });

      console.log("file uploaded to aws");

      // put the avatar url in the user document
      const response = await axios.put<ApiResponse>("api/v1/user/avatar", {
        avatar: url,
      });

      toast({
        title: "Avatar uploaded successfully",
      });
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while signing up";
      toast({
        title: "Error while changing avatar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Modal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Change Avatar"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Select your avatar"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          field.onChange(e.target.files[0]);
                        } else {
                          field.onChange(null);
                        }
                      }}
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
                "Upload"
              )}
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
}
