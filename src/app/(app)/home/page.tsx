"use client";
import Modal from "@/components/modals/avatar-modal";
import Navbar from "@/components/navbar/navbar";
import React, { useState } from "react";

const Homepage = () => {
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
      {/* <button
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        onClick={handleToggleModal}
      >
        Open Dialog
    </button>
    <Modal show={showModal} onClose={handleCloseModal} /> */}
    </>
  );
};

export default Homepage;
