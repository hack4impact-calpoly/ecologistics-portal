import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface PopupProps {
  name: string;
  user: string;
  email: string;
  website: string;
  description: string;
}

export default function Popup({ name, user, email, website, description }: PopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-500">View Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mx-5 mt-5">{name}</DialogTitle>
        </DialogHeader>
        <div className="mx-5 mb-5">
          <div className="my-3">{user}</div>
          <div className="my-3">{email}</div>
          <div className="my-3">{website}</div>
          <div className="my-3">NonProfit Mission: {description}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
