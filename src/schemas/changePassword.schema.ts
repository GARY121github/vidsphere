import { z } from "zod";
import { passwordSchema } from "./signUp.schema";

export const changePasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
});
