import { z } from "zod";
import { emailSchema } from "./signUp.schema";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
