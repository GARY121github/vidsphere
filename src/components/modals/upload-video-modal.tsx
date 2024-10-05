import { ArrowUpFromLine } from "lucide-react";
import Modal from "./modal";
import VideoUploadForm from "../forms/upload-video-form";

export default function UploadVideo({
  defaultOpen,
}: {
  defaultOpen?: boolean;
}) {
  return (
    <Modal
      title="Upload Video"
      className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
      Icon={ArrowUpFromLine}
      defaultOpen={defaultOpen || false}
    >
      <VideoUploadForm />
    </Modal>
  );
}
