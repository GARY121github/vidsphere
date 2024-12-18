import React from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChannelNavigation from "@/components/channel/channel-navigation";
import { ChannelProvider } from "@/providers/contexts/channel-context";
import { setChannelDetails } from "@/providers/store/features/channelSlice";
import config from "@/conf/config";
import Subscription from "@/components/channel/channel-subscription";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { channelName: string };
}) {
  const { channelName } = params;
  const channel = decodeURIComponent(channelName);
  const channelData = await fetchChannelDetails(channel);

  setChannelDetails({ ...channelData });

  return (
    <div>
      <div>
        {channelData ? (
          <div>
            <img
              src={channelData.coverImage}
              className="object-cover h-48 w-full rounded-lg"
              alt="channel"
            />
            <div className="mt-10 flex gap-10 items-center">
              <Avatar className="h-60 w-60">
                <AvatarImage
                  src={channelData.avatar}
                  alt={`@${channelData.username}`}
                />
                <AvatarFallback>channel</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-4 items-start">
                <h1 className="font-bold text-5xl text-center capitalize">
                  {channelData.fullName}
                </h1>
                <Subscription
                  hasSubscribed={channelData.hasSubscribed}
                  channelName={channelData.username}
                  channelSubscribers={channelData.subscribersCount}
                  channelId={channelData._id}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-bold">Channel Not Found</h1>
          </div>
        )}
      </div>
      {channelData && (
        <div className="flex flex-col gap-5 mt-5">
          <ChannelNavigation channelName={channel} className="sticky" />
          <div>
            <ChannelProvider initialChannelData={channelData}>
              {children}
            </ChannelProvider>
          </div>
        </div>
      )}
    </div>
  );
}

const fetchChannelDetails = async (channel: string) => {
  try {
    const response = await axios.get(
      `${config.BACKEND_API}/channel/${channel}`
    );
    return response.data.data;
  } catch (error) {
    console.log("channel not found");
    return null;
  }
};
