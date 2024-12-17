"use client";

import { postSchema } from "./create-post-form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormField, FormLabel, FormItem } from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import { Image, X } from "lucide-react";
import ApiResponse from "@/utils/ApiResponse";

interface EditPostFormProps {
  _id: string;
  content?: string;
  image?: string;
  isPublish?: boolean;
}

type PostFormSchema = z.infer<typeof postSchema>;

export default function EditPostForm({
  _id,
  content,
  image,
}: EditPostFormProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(
    image || null
  );
  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: content || "",
      image: undefined,
      isPublic: true,
    },
  });

  const onSubmit = async (data: PostFormSchema) => {
    setUploading(true);
    try {
      let imageUrl = imagePreview || ""; // Keep existing image URL if not changed
      if (data.image instanceof File) {
        const response = await axios.get<ApiResponse>("/api/v1/post/image");
        const url = response.data.data.url;

        await axios.put(url, data.image, {
          headers: {
            "Content-Type": data.image.type,
          },
        });
        imageUrl = url.split("?")[0]; // Store only the URL without query params
      }

      const response = await axios.put<ApiResponse>(`/api/v1/post/${_id}`, {
        content: data.content,
        image: imageUrl || undefined, // Prevent sending `undefined` for image
        isPublic: data.isPublic,
      });
      console.log(response.data);

      if (response.data.success) {
        toast({
          title: "Post updated successfully!",
          variant: "success",
        });
        form.reset({
          content: data.content,
          image: undefined,
          isPublic: data.isPublic,
        });
        setImagePreview(null);
      } else {
        throw new Error(response.data.message || "Failed to update post.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to update post",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      form.setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    form.setValue("image", undefined);
    setImagePreview(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Content Field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="mb-2 text-xl font-semibold">
                Content
              </FormLabel>
              <Textarea
                {...field}
                placeholder="What's happening?"
                rows={5}
                className="w-full rounded-lg p-3 text-black resize-none bg-slate-200"
                maxLength={500}
              />
              <span className="absolute right-2 bottom-2 text-gray-400 text-sm">
                {field.value.length}/500
              </span>
            </FormItem>
          )}
        />

        {/* Image Upload Section */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              {imagePreview ? (
                <div className="relative mt-4 flex justify-center rounded-lg shadow-lg p-2">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="max-h-72 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer">
                  <Image
                    size={24}
                    className="text-gray-400 hover:text-blue-500 transition"
                  />
                  <span className="text-gray-300">Add an Image</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                    className="hidden"
                  />
                </label>
              )}
            </FormItem>
          )}
        />

        {/* Is Public Switch */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
                className="bg-gray-600 border border-gray-500"
              />
              <span className="text-gray-300">Make Post Public</span>
            </div>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full py-2 rounded-full ${
            uploading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold transition duration-200`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Update Post"}
        </Button>
      </form>
    </Form>
  );
}
