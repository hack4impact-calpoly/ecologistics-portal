"use client";

import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/sponsored-org/sponsored-org-table/data-table";
import CenteredSpinner from "@/components/centered-spinner";

export default function SponsoredOrgTable() {
  const getReimbursementsUrl = "/api/reimbursement";
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getReimbursements() {
      try {
        const response = await fetch(getReimbursementsUrl);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}. Error: ${data.error}.`);
        }
        setReimbursements(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch reimbursements:", error);
      }
    }

    getReimbursements();
  }, []);

  if (loading) {
    return <CenteredSpinner />;
  }

  return <DataTable columns={columns} data={reimbursements} />;
}
