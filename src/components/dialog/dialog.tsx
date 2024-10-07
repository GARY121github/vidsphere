import React, { forwardRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LucideIcon } from "lucide-react";

interface DialogProps {
  alert?: string;
  AlertIcon?: LucideIcon;
  title: string;
  description?: string;
  action: string;
  actionHandler: () => void;
  alertStyle?: string;
  actionStyle?: string;
  titleStyle?: string;
  cancelStyle?: string;
}

const Dialog = forwardRef<HTMLButtonElement, DialogProps>(
  (
    {
      alert,
      AlertIcon,
      title,
      description,
      action,
      actionHandler,
      alertStyle,
      actionStyle,
      titleStyle,
      cancelStyle,
    },
    ref
  ) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger ref={ref} className={`${alertStyle}`}>
          {AlertIcon && <AlertIcon />}
          {alert && alert}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-700 text-white border-none p-6 max-w-[19%]">
          <AlertDialogHeader>
            <AlertDialogTitle className={titleStyle}>{title}</AlertDialogTitle>
            {description && (
              <AlertDialogContent>{description}</AlertDialogContent>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-5">
            <AlertDialogCancel className={`text-black ${cancelStyle}`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={actionHandler} className={actionStyle}>
              {action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;
