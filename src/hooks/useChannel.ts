import {
  setChannelDetails,
  removeChannelDetails,
} from "@/providers/store/features/channelSlice";
import { useAppDispatch, useAppSelector } from "./redux-hooks";

// Custom hook to interact with channel state
export const useChannel = () => {
  const dispatch = useAppDispatch();
  const channelDetail = useAppSelector((state) => state.channel);

  const setChannel = (details: {
    _id: string | null;
    channelName: string | null;
  }) => {
    dispatch(setChannelDetails(details));
  };

  const clearChannel = () => {
    dispatch(removeChannelDetails());
  };

  return {
    channelDetail,
    setChannel,
    clearChannel,
  };
};
