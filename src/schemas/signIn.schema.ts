import { z } from "zod";
import { userNameSchema } from "./signUp.schema";

const signInSchema = z.object({
  username: userNameSchema,
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

export default signInSchema;