import { z } from "zod";
import passwordSchema from "@/schemas/common/password.schema";
import userNameSchema from "@/schemas/common/username.schema";

const signInSchema = z.object({
  username: userNameSchema,
  password: passwordSchema,
});

export default signInSchema;
