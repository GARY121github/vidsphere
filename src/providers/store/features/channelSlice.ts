import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ChannelState {
  _id: string | null;
  channelName: string | null;
}

const initialState: ChannelState = {
  _id: null,
  channelName: null,
};

export const channlSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannelDetails: (
      state: RootState,
      action: PayloadAction<ChannelState>
    ) => {
      state._id = action.payload._id;
      state.channelName = action.payload.channelName;
    },
    removeChannelDetails: (state: RootState) => {
      state._id = null;
      state.channelName = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChannelDetails, removeChannelDetails } = channlSlice.actions;

export default channlSlice.reducer;
