"use client";
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

interface CreatePostModalProps {
  setRefreshPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Max 500 characters"),
  image: z.instanceof(File).optional(),
  isPublic: z.boolean(),
});

type PostFormSchema = z.infer<typeof postSchema>;

export default function PostForm({ setRefreshPost }: CreatePostModalProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      isPublic: true,
    },
  });

  const onSubmit = async (data: PostFormSchema) => {
    setUploading(true);
    try {
      let imageUrl = "";
      if (data.image) {
        const response = await axios.get<ApiResponse>("/api/v1/post/image");
        const url = response.data.data.url;
        await axios.put(url, data.image, {
          headers: {
            "Content-Type": data.image.type,
          },
        });
        imageUrl = url;
      }

      await axios.post<ApiResponse>("/api/v1/post", {
        content: data.content,
        image: imageUrl && imageUrl,
        isPublic: data.isPublic,
      });

      toast({
        title: "Post created successfully!",
        variant: "success",
      });

      setRefreshPost((prev) => !prev);
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create post",
        description: "Please try again",
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
          render={({ field }) => (
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
            uploading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold transition duration-200`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
