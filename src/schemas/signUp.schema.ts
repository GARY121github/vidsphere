import { z } from "zod";
import passwordSchema from "@/schemas/common/password.schema";
import userNameSchema from "@/schemas/common/username.schema";

export const emailSchema = z
  .string()
  .email({ message: "Invalid email address" });

export const fullNameSchema = z
  .string()
  .min(4, { message: "Name must be at least 4  characters long" })
  .max(30, { message: "Name must be at most 30 characters long" });

const signUpSchema = z.object({
  username: userNameSchema,
  email: emailSchema,
  fullName: fullNameSchema,
  password: passwordSchema,
});

export default signUpSchema;
