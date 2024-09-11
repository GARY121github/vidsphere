"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Upload } from "lucide-react";
import { useToast } from "../ui/use-toast";

const MAX_VIDEO_FILE_SIZE = 500000000; // 50MB

function checkVideoFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (
      fileType === "mp4" ||
      fileType === "mov" ||
      fileType === "webm" ||
      fileType === "avi" ||
      fileType === "mkv" ||
      fileType === "flv" ||
      fileType === "wmv"
    ) {
      return true;
    }
  }
  return false;
}

const formSchema = z.object({
  videoFile: z
    .any()
    .refine((file) => file?.length !== 0, "File is required")
    .refine((file) => file.size < MAX_VIDEO_FILE_SIZE, "Max size is 50MB.")
    .refine(
      (file) => checkVideoFileType(file),
      "Only .mp4, .mov, .webm, .avi, .mkv, .flv, .wmv formats are supported."
    ),
});

const VideoUploadForm = () => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoFile: new File([], ""),
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {};
  console.log(form.getValues());

  const handleReset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="videoFile"
          render={({ field }) => (
            <div
              className={`flex flex-col items-center justify-center gap-4 h-[70vh] ${
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
                <p className="text-md">Drag and drop video files to upload.</p>
                <p className="text-sm">
                  Your videos will be private until you publish them.
                </p>
              </div>
              <div className="relative">
                <label htmlFor="uploadVideo">
                  <p className="bg-white text-black p-2 rounded-full">
                    {form.watch("videoFile")?.size === 0
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
                      field.onChange(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              </div>
            </div>
          )}
        />
        <div className="w-full flex gap-4">
          <Button type="submit" variant={"secondary"} className="w-full">
            Upload
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
  );
};

export default VideoUploadForm;
