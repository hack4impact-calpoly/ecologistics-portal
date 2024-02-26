// Next, create a StatusBadge component that takes ReimbursementStatus as a prop and
// returns the corresponding badge as shown in the figma.
import Status from "@/lib/enum";
import { Badge } from "@/components/ui/badge";

export function choosingTheBadge(ReimbursementStatus: Status) {
  switch (ReimbursementStatus) {
    case Status.Pending:
      return (
        <Badge
          variant="status"
          className="bg-blue-200 font-medium text-blue-800"
        >
          Pending
        </Badge>
      );
    case Status.NeedsReview:
      return (
        <Badge
          variant="status"
          className="bg-gray-100 font-medium text-gray-700"
        >
          Needs Review
        </Badge>
      );
    case Status.OnHold:
      return (
        <Badge
          variant="status"
          className="bg-orange-100 font-medium text-orange-900"
        >
          On Hold
        </Badge>
      );
    case Status.Declined:
      return (
        <Badge variant="status" className="bg-red-100 font-medium text-red-900">
          Declined
        </Badge>
      );
    case Status.Paid:
      return (
        <Badge
          variant="status"
          className="bg-green-100 font-medium text-green-900"
        >
          Paid
        </Badge>
      );
    default:
      return (
        <Badge
          variant="status"
          className=" bg-orange-400 font-medium text-red-800"
        >
          ERROR
        </Badge>
      );
  }
}

export default function StatusBadge(ReimbursementStatus: Status) {
  return <div>{choosingTheBadge(ReimbursementStatus)}</div>;
}
