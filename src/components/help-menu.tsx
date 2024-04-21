import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export default function HelpMenu() {
  return (
    <Card className="flex w-[350px] gap-2 p-2">
      <div className="flex flex-col gap-2">
        <Badge
          style={{
            backgroundColor: "var(--green-bg)",
            color: "var(--green-text)",
            width: "fit-content",
          }}
        >
          Paid
        </Badge>

        <Badge
          style={{
            backgroundColor: "var(--orange-bg)",
            color: "var(--orange-text)",
            width: "fit-content",
          }}
        >
          On Hold
        </Badge>
        <Badge
          style={{
            backgroundColor: "var(--blue-bg)",
            color: "var(--blue-text)",
            width: "fit-content",
          }}
        >
          Pending
        </Badge>
        <Badge
          style={{
            backgroundColor: "var(--purple-bg)",
            color: "var(--purple-text)",
            width: "fit-content",
          }}
        >
          Review
        </Badge>
        <Badge
          style={{
            backgroundColor: "var(--red-bg)",
            color: "var(--red-text)",
            width: "fit-content",
          }}
        >
          Declined
        </Badge>
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
