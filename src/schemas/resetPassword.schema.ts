import { z } from "zod";
import { emailSchema } from "./signUp.schema";

export const resetPasswordSchema = z.object({
  email: emailSchema,
});
