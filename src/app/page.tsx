import ReimbursementCard from "@/components/reimbursement-card";
import AdminTable from "@/components/admin-table/admin-table";
import SponsoredOrgTable from "@/components/sponsored-org-table/sponsored-org-table";
import { data } from "@/test/mock-data";
import OrgSetup from "@/components/org-setup";

export default function Home() {
  return (
    <main>
      {/* <AdminTable /> */}
      {/* <SponsoredOrgTable /> */}
      {/* <ReimbursementCard
        {...data[0]}
        receiptLink="https://legaltemplates.net/wp-content/uploads/receipt-template.png"
      /> */}
      <OrgSetup />
    </main>
  );
}
