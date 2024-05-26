export interface Organization {
  name: string;
  description: string;
  website?: string;
  logo?: string;
  reimbursements: string[];
  status: string;
  approved: boolean;
}
