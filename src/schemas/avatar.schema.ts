import { z } from "zod";

export const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB

export const fileTypes = ["image/jpeg", "image/png"];

const avatarSchema = z.object({
  filename: z.string().min(1).max(255),
  filetype: z.string().refine((type) => fileTypes.includes(type), {
    message: "Invalid file type",
    path: ["filetype"],
  }),
  filesize: z.number().refine((size) => size <= MAX_FILE_SIZE, {
    message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    path: ["filesize"],
  }),
  file: z
    .instanceof(File)
    .refine((file) => fileTypes.includes(file.type), {
      message: "Invalid file type",
      path: ["file"],
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      path: ["file"],
    }),
});

export default avatarSchema;
