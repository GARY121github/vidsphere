import { SquarePen } from "lucide-react";
import Modal from "./modal";
import VideoUploadForm from "../forms/upload-video-form";

export default function UpdateVideoDetails({
  defaultOpen,
}: {
  defaultOpen?: boolean;
}) {
  return (
    <Modal
      className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
      Icon={SquarePen}
      defaultOpen={defaultOpen || false}
      triggerClassName="p-0 bg-transparent text-white hover:bg-transparent"
    >
      <VideoUploadForm />
    </Modal>
  );
}
