import { z } from "zod";
import passwordSchema from "@/schemas/common/password.schema";

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"], // error will be associated with confirmPassword
    message: "New Password doesnt matched with Confirm Password",
  });
