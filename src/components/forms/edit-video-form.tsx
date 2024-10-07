"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { videoDetailsSchema } from "@/schemas/video.schema";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function EditVideoForm({
  title,
  description,
  videoId,
  setReloadVideos,
}: {
  title: string;
  description: string;
  videoId: string;
  setReloadVideos: React.Dispatch<React.SetStateAction<Boolean>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof videoDetailsSchema>>({
    resolver: zodResolver(videoDetailsSchema),
    defaultValues: {
      title: title,
      description: description,
    },
  });

  async function onSubmit(values: z.infer<typeof videoDetailsSchema>) {
    if (
      title === values.title.trim() &&
      description === values.description.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Nothing Updated",
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.patch(`/api/v1/video/${videoId}`, {
        title: values.title,
        description: values.description,
      });
      toast({
        title: "Videos Data Updated Successfully",
      });
      setReloadVideos((prev) => !prev);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error while updating the video",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2">
        <h1 className="text-3xl font-semibold">Change Video Details</h1>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="Add title that describe your video"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none text-black"
                  placeholder="Tell viewers about your video"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
            </>
          ) : (
            "update details"
          )}
        </Button>
      </form>
    </Form>
  );
}
