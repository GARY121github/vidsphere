import { z } from "zod";
import userNameSchema from "@/schemas/common/username.schema";
import { emailSchema, fullNameSchema } from "./signUp.schema";

const userProfileSchema = z.object({
  username: userNameSchema,
  email: emailSchema,
  fullName: fullNameSchema,
});

export default userProfileSchema;
