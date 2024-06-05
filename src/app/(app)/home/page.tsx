"use client";
import Navbar from "@/components/navbar/navbar";
import React, { useState } from "react";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Navbar />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        onClick={handleToggleModal}
      >
        Open Dialog
      </button>
    </>
  );
}
