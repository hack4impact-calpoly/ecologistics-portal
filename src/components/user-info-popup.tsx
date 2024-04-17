import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PopupProps {
  organization: string;
  user: string;
  email: string;
  link: string;
  description: string;
}

export default function Popup({
  organization,
  user,
  email,
  link,
  description,
}: PopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mx-5 mt-5">{organization}</DialogTitle>
        </DialogHeader>
        <div className="mx-5 mb-5">
          <div className="my-3">{user}</div>
          <div className="my-3">{email}</div>
          <div className="my-3">{link}</div>
          <div className="my-3">NonProfit Mission: {description}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
