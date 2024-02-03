import { Payment, columns } from "./columns";
import { DataTable } from "@/components/sponsor-table/data-table";

const mockData: Array<Payment> = [];
for (let i = 0; i < 30; i++) {
  mockData.push({
    request: "request",
    requestFor: "request for",
    amount: 342,
    status: "paid",
    requestDate: new Date(),
    receipt: "receipt",
  });
}

export default async function SponsorTable() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={mockData} filterCol="request" />
    </div>
  );
}
