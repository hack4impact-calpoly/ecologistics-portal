import { forwardRef, useImperativeHandle } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UploadPopupProps {
  success: boolean;
}

const UploadPopup = forwardRef(({ success }: UploadPopupProps, ref) => {
  // Use imperativeHandle to expose openDialog function to parent
  useImperativeHandle(ref, () => ({
    openDialog() {
      const trigger = document.getElementById("upload-popup-trigger");
      if (trigger) trigger.click();
    },
  }));

  return (
    <div>
      <Dialog>
        <DialogTrigger id="upload-popup-trigger"></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {success ? (
              <DialogTitle>Receipt Upload Complete</DialogTitle>
            ) : (
              <DialogTitle>Receipt Upload Failed</DialogTitle>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
});

UploadPopup.displayName = "UploadPopup";

export default UploadPopup;
