"use client";
import UploadVideoModal from "@/components/modals/upload-video-modal";
import ChannelVideoDetailsTable from "@/components/table/channel-videos-table";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function ChannelContent({
  params,
}: {
  params: { channelId: string };
}) {
  const channelId = params.channelId;
  const [reloadVideos, setReloadVideos] = useState<Boolean>(false);
  return (
    <div className="flex flex-col gap-5">
      <section className="flex justify-between">
        <h1 className="text-4xl font-semibold">Channel's Videos</h1>
        <UploadVideoModal setReloadVideos={setReloadVideos} />
      </section>
      <Separator />
      <section>
        <ChannelVideoDetailsTable
          channelId={channelId}
          reloadVideos={reloadVideos}
          setReloadVideos={setReloadVideos}
        />
      </section>
    </div>
  );
}
