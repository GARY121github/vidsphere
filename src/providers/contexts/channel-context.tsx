"use client";
import React, { createContext, useContext, useState } from "react";

interface ChannelContextType {
  channelDetail: { _id: string | null; channelName: string | null } | null;
  setChannel: (details: {
    _id: string | null;
    channelName: string | null;
  }) => void;
  clearChannel: () => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{
  children: React.ReactNode;
  initialChannelData?: { _id: string | null; channelName: string | null };
}> = ({ children, initialChannelData }) => {
  const [channelDetail, setChannelDetail] = useState<{
    _id: string | null;
    channelName: string | null;
  } | null>(initialChannelData || null);

  const setChannel = (details: {
    _id: string | null;
    channelName: string | null;
  }) => {
    setChannelDetail(details);
  };

  const clearChannel = () => {
    setChannelDetail(null);
  };

  return (
    <ChannelContext.Provider
      value={{ channelDetail, setChannel, clearChannel }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannel must be used within a ChannelProvider");
  }
  return context;
};
