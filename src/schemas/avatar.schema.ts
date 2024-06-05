import { z } from "zod";

// Constants
export const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
function checkImageFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      return true;
    }
  }
  return false;
}

// File Schema
const avatar = z
  .any()
  .refine((file) => file?.length !== 0, { message: "File is required" })
  .refine((file) => file.size < MAX_FILE_SIZE, { message: "Max size is 10MB." })
  .refine((file) => checkImageFileType(file), {
    message: "Only .jpg, .jpeg, .png, .gif formats are supported.",
  });

const avatarSchema = z.object({
  avatar: avatar,
});

// Export the Schema
export default avatarSchema;
