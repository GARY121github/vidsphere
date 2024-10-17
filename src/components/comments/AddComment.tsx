import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface AddCommentProps {
  setAddCommentContent: (content: string) => void;
}

const addCommentContentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(200),
});

const AddComment = ({ setAddCommentContent }: AddCommentProps) => {
  const form = useForm({
    resolver: zodResolver(addCommentContentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: z.infer<typeof addCommentContentSchema>) => {
    setAddCommentContent(data.content);
    form.reset();
  };

  const handleSpaceKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === "Space") {
      event.stopPropagation();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 text-black"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your comment here..."
                  {...field}
                  rows={3}
                  onKeyDown={handleSpaceKey}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary">
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default AddComment;
