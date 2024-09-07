"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store/store";

const ReduxProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default ReduxProviderWrapper;
