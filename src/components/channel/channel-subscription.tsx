"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Dialog from "../dialog/dialog";
import { useToast } from "../ui/use-toast";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/utils/ApiResponse";

interface SubscriptionProps {
  channelId: string;
  hasSubscribed: boolean;
  channelName: string;
  channelSubscribers: number;
}

export default function Subscription({
  hasSubscribed,
  channelName,
  channelSubscribers,
  channelId,
}: SubscriptionProps) {
  const [subscribers, setSubscribers] = useState<number>(channelSubscribers);
  const [subscription, setSubscription] = useState<boolean>(hasSubscribed);
  const { toast } = useToast();

  const toggleSubscription = async () => {
    setSubscribers((prev) => (subscription ? prev - 1 : prev + 1));
    setSubscription((prev) => !prev);
    toast({
      title: `${subscription ? "Unsubscribed Successfully" : "Subscribed Successfully"}`,
    });
    try {
      await axios.put<ApiResponse>(`/api/v1/subscription/c/${channelId}`);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Something went wrong while toggeling the subscrpition",
        description:
          errorMessage ||
          "Something went wrong while toggeling the subscrpition",
        variant: "destructive",
      });
      setSubscribers((prev) => (subscription ? prev + 1 : prev - 1));
      setSubscription((prev) => !prev);
    }
  };

  return (
    <div>
      <p className="text-2xl mb-2">
        {channelName} | {subscribers} subscribers{" "}
      </p>
      {subscription ? (
        <Dialog
          alert="Unsubscribe"
          alertStyle="bg-gray-700 p-3 rounded-3xl inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
          title={`Unsubscribe from ${channelName}`}
          action="Unsubscribe"
          actionHandler={toggleSubscription}
        />
      ) : (
        <Button
          onClick={toggleSubscription}
          variant="secondary"
          className="bg-white p-4 rounded-full text-black hover:bg-slate-300"
        >
          Subscribe
        </Button>
      )}
    </div>
  );
}
