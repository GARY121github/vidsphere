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
  );

export const videoSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  thumbnail: z.string().url(),
  videoUrls: z.array(
    z.object({
      link: z.string().url(),
      quality: z.string().min(1).max(10),
    })
  ),
  owner: z.string(),
  status: statusSchema,
});
