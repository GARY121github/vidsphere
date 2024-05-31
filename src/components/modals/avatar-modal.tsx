import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "@/components/ui/input";

const fileUploadSchema = z.object({
  files: z.array(z.any()).nonempty("Please select a file"),
});

const Modal = ({ show, onClose }: any) => {
  const form = useForm<z.infer<typeof fileUploadSchema>>({
    resolver: zodResolver(fileUploadSchema),
  });

  const modalRef = useRef<HTMLDialogElement>(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Profile picture set:", profilePicture);
  };

  useEffect(() => {
    if (modalRef.current) {
      if (show) {
        modalRef.current.showModal();
      } else {
        modalRef.current.close();
      }
    }
  }, [show]);

  return (
    <dialog
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 rounded-lg ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-4 md:p-5">
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Avatar className="w-20 h-20 rounded-full mx-auto">
              <AvatarImage src={preview} alt="@shadcn" />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      type="file"
                      placeholder="Select a file"
                      {...field}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add Your Avatar
            </button>
          </form>
        </Form>

        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-4 right-4 hover:outline hover:outline-pink-500 hover:outline-rounded rounded-md"
        >
          ❌
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
