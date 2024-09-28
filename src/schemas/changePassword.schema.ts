import { z } from "zod";
import passwordSchema from "@/schemas/common/password.schema";

export const changePasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
});
