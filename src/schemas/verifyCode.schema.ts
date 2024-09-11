import { z } from "zod";
import userNameSchema from "@/schemas/common/username.schema";

const verifyCodeSchema = z.object({
  username: userNameSchema,
  code: z.string().length(6, { message: "Code must be 6 characters long" }),
});

export default verifyCodeSchema;
