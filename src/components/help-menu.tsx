import StatusBadge from "./status-badge";
import { Card } from "./ui/card";
import Status from "@/lib/enum";

export default function HelpMenu() {
  return (
    <Card className="flex w-[350px] gap-2 p-2">
      <div className="flex flex-col gap-2">
        <StatusBadge ReimbursementStatus={Status.Paid} />
        <StatusBadge ReimbursementStatus={Status.OnHold} />
        <StatusBadge ReimbursementStatus={Status.Pending} />
        <StatusBadge ReimbursementStatus={Status.NeedsReview} />
        <StatusBadge ReimbursementStatus={Status.Declined} />
      </div>
      <div className="flex flex-col gap-2.5 text-left">
        <span>Request has been paid</span>
        <span>Request has missing information</span>
        <span>Awaiting admin to fulfill payment</span>
        <span>Awaiting admin review</span>
        <span>Request was declined</span>
      </div>
    </Card>
  );
}
