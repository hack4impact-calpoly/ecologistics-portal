"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/sponsor-table/data-table";
import { data } from "./mock-data";

export default function SponsorTable() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} filterCol="reportName" />
    </div>
  );
}
