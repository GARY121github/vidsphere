"use client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import Image from "next/image";
import { thumbnailSchema } from "@/schemas/video.schema";

export default function ChangeVideoThumbnailForm({
  thumbnail,
  videoId,
  setReloadVideos,
}: {
  thumbnail: string;
  videoId: string;
  setReloadVideos: React.Dispatch<React.SetStateAction<Boolean>>;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileEnter, setFileEnter] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(thumbnailSchema),
    defaultValues: {
      thumbnail: null,
    },
  });

  async function onSubmit(values: z.infer<typeof thumbnailSchema>) {
    if (!values.thumbnail) {
      console.log("No file selected");
      return;
    }
    setIsUploading(true);
    try {
      // get the presigned url from server
      const preSignedUrl = await axios.get<ApiResponse>(
        `/api/v1/video/${videoId}/thumbnail`
      );
      const { url } = preSignedUrl.data.data;

      // upload the file to aws s3 bucket
      await axios.put(url, values.thumbnail, {
        headers: {
          "Content-Type": values.thumbnail.type,
        },
      });

      // put the thumbnail url in the video document
      await axios.put<ApiResponse>(`/api/v1/video/${videoId}/thumbnail`, {
        thumbnail: url.split("?")[0],
      });

      toast({
        title: "Thumbnail Updated Successfully",
      });

      setReloadVideos((prev) => !prev);
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
      setIsUploading(false);
    }
  }

  const handelReset = () => {
    setFile(undefined);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-3xl font-semibold">Change Thumbnail</h1>
        <div className="grid grid-cols-2 items-center gap-2">
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="rounded-lg object-cover max-h-72 w-full"
          />
          {!file ? (
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setFileEnter(true);
                      }}
                      onDragLeave={(e) => {
                        setFileEnter(false);
                      }}
                      onDragEnd={(e) => {
                        e.preventDefault();
                        setFileEnter(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setFileEnter(false);
                        if (e.dataTransfer.items) {
                          [...e.dataTransfer.items].forEach((item, i) => {
                            if (item.kind === "file") {
                              const file = item.getAsFile();
                              if (file) {
                                setFile(file);
                              }
                            }
                          });
                        } else {
                          [...e.dataTransfer.files].forEach((file, i) => {
                            console.log(`… file[${i}].name = ${file.name}`);
                          });
                        }
                      }}
                      className={`${
                        fileEnter ? "border-4" : "border-2"
                      } mx-auto  flex flex-col w-full h-72 border-dashed items-center justify-center`}
                    >
                      <FormLabel
                        htmlFor="avatar"
                        className="h-full flex flex-col justify-center text-center"
                      >
                        Click to upload or drag and drop
                      </FormLabel>
                      <Input
                        id="avatar"
                        type="file"
                        placeholder="Select your avatar"
                        className="hidden"
                        onChange={(e) => {
                          let files = e.target.files;
                          if (files && files.length > 0) {
                            field.onChange(files[0]);
                            setFile(files[0]);
                          } else {
                            field.onChange(null);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <Image
              src={URL.createObjectURL(file)}
              alt="avatar"
              width={innerWidth}
              height={innerHeight}
              className="rounded-lg object-cover max-h-72 max-w-full mx-auto"
            />
          )}
        </div>

        <div className="w-full flex gap-4">
          <Button
            type="submit"
            variant={"secondary"}
            className={`w-full ${isUploading ? "disabled disabled:opacity-50" : ""}`}
          >
            {!isUploading ? "Upload" : <Loader2 className="animate-spin" />}
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            className="w-full"
            onClick={handelReset}
            disabled={isUploading}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
