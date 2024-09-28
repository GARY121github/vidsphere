// import React, { useState } from "react";
// import { useToast } from "../ui/use-toast";
// import { videoSchema } from "@/schemas/video.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import Modal from "../modal";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// const VideoUpdateModal = () => {
//   const [thumbnail, setThumbnail] = useState("");
//   const form = useForm<z.infer<typeof videoSchema>>({
//     resolver: zodResolver(videoSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       thumbnailUrl: "",
//       owner: "",
//     },
//   });
//   const { toast } = useToast();

//   return (
//     <Modal
//       title="Upload Video"
//       className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
//     >
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter your title here..." {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   This is your public display name.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter your description here..."
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   This is your public display name.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </Modal>
//   );
// };

// export default VideoUpdateModal;
