import { z } from "zod";

export const contentSchema = z
  .string()
  .trim()
  .min(4, { message: "Content must be atleast 4 letters long" })
  .max(600, { message: "Content must be atmost 600 letters" });

const postSchema = z.object({
  content: contentSchema,
  isPublic: z.boolean().optional(),
});

export default postSchema;
