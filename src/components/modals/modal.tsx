import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { LucideIcon } from "lucide-react";

interface ModalProps {
  triggerChildren?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  Icon?: LucideIcon; // Change to React.ElementType to accept any component
  className?: string;
  triggerClassName?: string;
  defaultOpen?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      triggerChildren,
      title,
      description,
      children,
      className,
      Icon,
      triggerClassName,
      defaultOpen,
    },
    ref
  ) => {
    return (
      <Dialog defaultOpen={defaultOpen}>
        <DialogTrigger asChild>
          {triggerChildren ? (
            triggerChildren
          ) : (
            <Button variant="secondary" className={`${triggerClassName}`}>
              {Icon && <Icon className="mr-2" />}
              {title && title}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className={`bg-white text-black ${className}`} ref={ref}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

Modal.displayName = "Modal"; // Add displayName for better debugging

export default Modal;
