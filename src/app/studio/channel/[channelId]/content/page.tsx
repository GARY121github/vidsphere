"use client";
import UploadVideoModal from "@/components/modals/upload-video-modal";
import ChannelVideoDetailsTable from "@/components/table/channel-videos-table";
import { Separator } from "@/components/ui/separator";
import config from "@/conf/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Video } from "@/components/table/channel-videos-table";
import { Loader2 } from "lucide-react";

export default function ChannelContent({
  params,
}: {
  params: { channelId: string };
}) {
  const channelId = params.channelId;

  return (
    <div className="flex flex-col gap-5">
      <section className="flex justify-between">
        <h1 className="text-4xl font-semibold">Channel's Videos</h1>
        <UploadVideoModal />
      </section>
      <Separator />
      <section>
        <ChannelVideoDetailsTable channelId={channelId} />
      </section>
    </div>
  );
}
