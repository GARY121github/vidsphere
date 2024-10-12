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
                  placeholder="enter your comment here..."
                  {...field}
                  rows={3}
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
