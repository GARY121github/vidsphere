"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Define schema for form validation using Zod
const FormSchema = z.object({
  visibility: z.enum(["public", "private"]).default("private"),
});

export function ChangeVideoVisibility({
  isPublished,
  videoId,
  setReloadVideos,
}: {
  isPublished: boolean;
  videoId: string;
  setReloadVideos: React.Dispatch<React.SetStateAction<Boolean>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visibility: isPublished ? "public" : "private",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    let currentValue: boolean = values.visibility === "public" ? true : false;
    if (currentValue === isPublished) {
      toast({
        variant: "destructive",
        title: "Nothing updated",
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`/api/v1/video/${videoId}/visibility`);
      toast({
        title: "Videos Visibility Toggeled Successfully",
      });
      setReloadVideos((prev) => !prev);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error while toggling the visibility of the video",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-3xl font-semibold mb-5">
                Change Video Visibility
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value} // Ensure the selected value is used
                  className="flex flex-col space-y-1"
                >
                  <FormItem
                    className={`flex items-center border p-4 justify-between rounded-lg ${
                      field.value === "public"
                        ? "bg-green-500 border-green-500"
                        : "border-white"
                    }`}
                  >
                    <FormLabel className="flex flex-col gap-2">
                      <p className="font-semibold">Public</p>
                      <span>Everyone will be able to see this video</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="public" className="text-white" />
                    </FormControl>
                  </FormItem>
                  <FormItem
                    className={`flex items-center border p-4 justify-between rounded-lg ${
                      field.value === "private"
                        ? "bg-red-500 border-red-500"
                        : "border-white"
                    }`}
                  >
                    <FormLabel className="flex flex-col gap-2">
                      <p className="font-semibold">Private</p>
                      <span>Only you will be able to see this</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="private" className="text-white" />
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          variant="secondary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
            </>
          ) : (
            "Change Visibility"
          )}
        </Button>
      </form>
    </Form>
  );
}
