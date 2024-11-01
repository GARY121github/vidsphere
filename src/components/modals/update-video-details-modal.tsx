import { SquarePen } from "lucide-react";
import Modal from "./modal";
import EditVideoForm from "../forms/edit-video-form";
import ChangeVideoVisibilityForm from "../forms/change-video-visibility-form";
import ChangeVideoThumbnail from "../forms/change-video-thumbnail-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UpdateVideoDetailsProps {
  defaultOpen?: boolean;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  isPublished: boolean;
  setReloadVideos: React.Dispatch<React.SetStateAction<Boolean>>;
}

export default function UpdateVideoDetailsModal({
  defaultOpen,
  videoId,
  title,
  description,
  isPublished,
  thumbnail,
  setReloadVideos,
}: UpdateVideoDetailsProps) {
  const EditForms = [
    {
      title: "Thumbnail",
      form: (
        <ChangeVideoThumbnail
          thumbnail={thumbnail}
          videoId={videoId}
          setReloadVideos={setReloadVideos}
        />
      ),
    },
    {
      title: "Video Meta Data",
      form: (
        <EditVideoForm
          title={title}
          description={description}
          videoId={videoId}
          setReloadVideos={setReloadVideos}
        />
      ),
    },
    {
      title: "Video Visibility",
      form: (
        <ChangeVideoVisibilityForm
          isPublished={isPublished}
          videoId={videoId}
          setReloadVideos={setReloadVideos}
        />
      ),
    },
  ];

  return (
    <Modal
      className="max-w-4xl w-full text-white bg-[#303030] border-0"
      Icon={SquarePen}
      defaultOpen={defaultOpen || false}
      triggerClassName="p-0 bg-transparent text-white hover:bg-transparent"
    >
      <Tabs
        defaultValue="Video Meta Data"
        className="w-full flex flex-col justify-center gap-8"
      >
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          {EditForms.map((form, index) => (
            <TabsTrigger value={form.title} key={index}>
              {form.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {EditForms.map((form, index) => (
          <TabsContent value={form.title} key={index}>
            {form.form}
          </TabsContent>
        ))}
      </Tabs>
    </Modal>
  );
}
