import Reimbursement from "@/database/reimbursement-schema";
import { createMocks } from "node-mocks-http";

export const createMockNextRequest = (request: any) =>
  createMocks({
    json: () => Promise.resolve(request),
  });

export const formatMockReimbursementResponse = (
  reimbursement: Reimbursement,
) => ({
  ...reimbursement,
  organization: reimbursement.organization.toHexString(),
  transactionDate: reimbursement.transactionDate.toISOString(),
});

export const formatMockReimbursementsResponse = (
  reimbursements: Reimbursement[],
) => reimbursements.map(formatMockReimbursementResponse);
