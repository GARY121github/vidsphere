import { Plus } from "lucide-react";
import Modal from "./modal";
import CreatePostForm from "../forms/create-post-form";

interface CreatePostModalProps {
  setRefreshPost: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePostModal({
  setRefreshPost,
}: CreatePostModalProps) {
  return (
    <Modal
      title="Create Post"
      className="max-w-4xl w-full text-white bg-[#303030] border-0"
      Icon={Plus}
    >
      <CreatePostForm setRefreshPost={setRefreshPost} />
    </Modal>
  );
}
