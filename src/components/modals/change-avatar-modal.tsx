"use client";
import Modal from "@/components/modals/modal";
import ChangeAvatarForm from "../forms/change-avatar-form";
import { Pen } from "lucide-react";

export default function ChangeAvatarModal() {
  return (
    <Modal
      title="Change Avatar"
      className="text-white bg-[#303030] border-0"
      Icon={Pen}
    >
      <ChangeAvatarForm />
    </Modal>
  );
}
