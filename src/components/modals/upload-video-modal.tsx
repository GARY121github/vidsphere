import { ArrowUpFromLine } from "lucide-react";
import Modal from "./modal";
import VideoUploadForm from "../forms/upload-video-form";

export default function UploadVideoModal({
  defaultOpen,
  setReloadVideos,
}: {
  defaultOpen?: boolean;
  setReloadVideos: React.Dispatch<React.SetStateAction<Boolean>>;
}) {
  return (
    <Modal
      title="Upload Video"
      className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
      Icon={ArrowUpFromLine}
      defaultOpen={defaultOpen || false}
    >
      <VideoUploadForm setReloadVideos={setReloadVideos} />
    </Modal>
  );
}
