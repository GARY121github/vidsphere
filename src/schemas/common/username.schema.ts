import { z } from "zod";

const userNameSchema = z
  .string()
  .trim()
  .min(4, { message: "Username must be at least 4  characters long" })
  .max(30, { message: "Username must be at most 30 characters long" })
  .regex(
    /^[a-zA-Z0-9_]*$/,
    "Username must only contain letters, numbers, and underscores"
  );

export default userNameSchema;
