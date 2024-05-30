import { z } from "zod";

export const userNameSchema = z
  .string()
  .trim()
  .min(4, { message: "Username must be at least 4  characters long" })
  .max(30, { message: "Username must be at most 30 characters long" })
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username must only contain letters, numbers, and underscores"
  );

const signUpSchema = z.object({
  username: userNameSchema,
  email: z.string().email({ message: "Invalid email address" }),
  fullName: z
    .string()
    .min(4, { message: "Name must be at least 4  characters long" })
    .max(30, { message: "Name must be at most 30 characters long" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(16, "Password must be at most 16 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export default signUpSchema;
