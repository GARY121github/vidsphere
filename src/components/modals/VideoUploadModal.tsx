"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Upload } from "lucide-react";
import { useToast } from "../ui/use-toast";
import Modal from "../modal";
import { videoFileSchema, videoSchema } from "@/schemas/video.schema";
import axios, { AxiosError } from "axios";
import ApiError from "@/utils/ApiError";
import mongoose from "mongoose";
import ApiResponse from "@/utils/ApiResponse";

const VideoUploadForm = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof videoFileSchema>>({
    resolver: zodResolver(videoFileSchema),
    defaultValues: {
      videoFile: new File([], ""),
    },
  });

  const getSignedUrl = async () => {
    try {
      const response = await axios.get("/api/v1/video/upload");
      console.log(response.data);

      return response.data.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while getting signed URL";
      return new ApiError(axiosError?.response?.status ?? 500, errorMessage);
    }
  };

  const uploadVideoToS3 = async (signedUrl: string, videoFile: File) => {
    try {
      const response = await axios.put(signedUrl, videoFile, {
        headers: {
          "Content-Type": videoFile.type,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Upload Successful!",
          description: "Video uploaded successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Upload Failed!",
          description: response.data.message || "Video Upload failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while uploading video";
      return new ApiError(axiosError?.response?.status ?? 500, errorMessage);
    }
  };

  const onSubmit = async (data: z.infer<typeof videoFileSchema>) => {
    setUploading(true);
    try {
      if (data?.videoFile.name === "") {
        toast({
          title: "Video not selected!",
          description: "Please select a video to upload",
          variant: "destructive",
        });
        return;
      }
      const signedUrl = await getSignedUrl();
      await uploadVideoToS3(signedUrl, data.videoFile);
      const response = await axios.post("/api/v1/video/upload", {
        uniqueID: signedUrl.videoLocation,
      });

      if (response.data.success === false) {
        toast({
          title: "Upload Failed!",
          description: response.data.message || "Video Upload failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while uploading video";
      console.log(axiosError.response?.data);

      toast({
        title: "Upload Failed!",
        description: errorMessage || "Video Upload failed",
        variant: "destructive",
      });
    } finally {
      handleReset();
      setUploading(false);
    }
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <Modal
      title="Upload Video"
      className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="videoFile"
            render={({ field }) => (
              <div
                className={`flex flex-col items-center justify-center gap-4 h-[65vh] mb-4 ${
                  dragActive && "bg-[#292929]"
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  dragActive &&
                    form.setValue("videoFile", e.dataTransfer.files[0]);
                  setDragActive(false);
                }}
              >
                <div className="rounded-full h-36 w-36 bg-[#1d1d1e] items-center justify-center flex">
                  <Upload className="h-16 w-16 text-stone-100" />
                </div>
                <div className="text-center">
                  <p className="text-md">
                    Drag and drop video files to upload.
                  </p>
                  <p className="text-sm">
                    Your videos will be private until you publish them.
                  </p>
                </div>
                <div className="relative">
                  <label htmlFor="uploadVideo">
                    <p className="bg-white text-black p-2 px-4 rounded-full">
                      {form.watch("videoFile").name === ""
                        ? "Select Video"
                        : form.watch("videoFile").name}
                    </p>
                    <Input
                      id="uploadVideo"
                      type="file"
                      className="hidden"
                      placeholder="Upload Video"
                      accept="video/*"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : new File([], "")
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            )}
          />
          <div className="w-full flex gap-4">
            <Button
              type="submit"
              variant={"secondary"}
              className={`w-full ${uploading ? "disabled disabled:opacity-50" : ""}`}
            >
              {!uploading ? "Upload" : "Uploading..."}
            </Button>
            <Button
              type="button"
              variant={"destructive"}
              className="w-full"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default VideoUploadForm;
