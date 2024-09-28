import { z } from "zod";

export const videoSearchSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  query: z.string().optional().default(""),
  sortBy: z.string().optional().default(""),
  sortType: z
    .string()
    .refine((value) => ["asc", "desc"].includes(value), {
      message: "Invalid sort type",
    })
    .optional()
    .default("desc"),
  userId: z.string().optional().default(""),
});

export const titleSchema = z
  .string()
  .min(1, {
    message: "Title must be at least 1 character long",
  })
  .max(100, {
    message: "Title must be at most 100 characters long",
  });

export const descriptionSchema = z
  .string()
  .min(3, {
    message: "Description must be at least 3 characters long",
  })
  .max(500, {
    message: "Description must be at most 500 characters long",
  });

export const statusSchema = z
  .string()
  .refine(
    (value) => ["uploading", "transcoding", "completed"].includes(value),
    {
      message: "Invalid status",
    }
  )
  .default("uploading");

export const videoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  thumbnailUrl: z.string().url(),
  videoUrls: z
    .array(
      z.object({
        link: z.string().url(),
        quality: z.string().min(1).max(10),
      })
    )
    .optional(),
  owner: z.string(),
  status: statusSchema,
});

const MAX_VIDEO_FILE_SIZE = 500000000; // 50MB
const MAX_THUMBNAIL_SIZE = 50000000; // 5MB

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

function checkThumbnailFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      return true;
    }
  }
  return false;
}

export const videoFileSchema = z.object({
  videoFile: z
    .any()
    .refine((file) => file?.length !== 0, "File is required")
    .refine((file) => file.size < MAX_VIDEO_FILE_SIZE, "Max size is 50MB.")
    .refine(
      (file) => checkVideoFileType(file),
      "Only .mp4, .mov, .webm, .avi, .mkv, .flv, .wmv formats are supported."
    ),
});

export const thumnailSchema = z.object({
  thumbnail: z
    .any()
    .refine((file) => file?.length !== 0, "File is required")
    .refine((file) => file.size < MAX_THUMBNAIL_SIZE, "Max size is 5MB.")
    .refine(
      (file) => checkThumbnailFileType(file),
      "Only .jpg, .jpeg, .png formats are supported."
    ),
});
