import UploadVideo from "@/components/modals/upload-video-modal";
import ChannelVideoDetailsTable from "@/components/table/channel-videos-table";
import { Separator } from "@/components/ui/separator";

export default function ChannelContent() {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex justify-between">
        <h1 className="text-4xl font-semibold">Channel's Videos</h1>
        <UploadVideo />
      </section>
      <Separator />
      <section>
        <ChannelVideoDetailsTable />
      </section>
    </div>
  );
}
