import { z } from "zod";
import { passwordSchema, userNameSchema } from "./signUp.schema";

const signInSchema = z.object({
  username: userNameSchema,
  password: passwordSchema,
});

export default signInSchema;
