"use client";
import React, { useState } from "react";
import Modal from "../modal";

import VideoUploadForm from "../forms/VideoUploadForm";

const VideoUploadModal = () => {
  return (
    <>
      <Modal
        title="Upload Video"
        className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
      >
        <VideoUploadForm />
      </Modal>
    </>
  );
};

export default VideoUploadModal;
