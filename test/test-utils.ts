import Reimbursement from "@/database/reimbursement-schema";
import { createMocks } from "node-mocks-http";

export const createMockNextRequest = (body: any) =>
  createMocks({
    json: () => Promise.resolve(body),
  });

export const formatMockReimbursementResponse = (
  reimbursement: Reimbursement,
) => ({
  ...reimbursement,
  _id: reimbursement._id.toString(), // Ensure _id is a string
  organization: reimbursement.organization.toString(), // Convert to string if necessary
  transactionDate: reimbursement.transactionDate.toISOString(), // Standardize date format
});

export const createNextRequestWithParams = (
  body: any,
  id: string,
  method = "GET",
) => {
  const { req, res } = createMocks({
    method: method,
    json: () => Promise.resolve(body),
  });

  // Ensure params are directly added in a manner that your handlers expect
  req.params = { id };

  // Mock req.json to simulate JSON parsing of the body
  req.json = async () => Promise.resolve(body);

  return { req, res };
};

export const formatMockReimbursementsResponse = (
  reimbursements: Reimbursement[],
) => reimbursements.map(formatMockReimbursementResponse);
