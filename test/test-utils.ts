import Reimbursement from "@/database/reimbursement-schema";
import { ObjectId } from "mongoose";
import { createMocks, RequestMethod } from "node-mocks-http";

export const createMockNextRequest = (body: any) =>
  createMocks({
    json: () => Promise.resolve(body),
  });

export const formatMockReimbursementResponse = (
  reimbursement: Reimbursement,
) => ({
  ...reimbursement,
  organization: reimbursement.organization.toString(), // Convert to string if necessary
  transactionDate: reimbursement.transactionDate.toISOString(), // Standardize date format
});

export const createNextRequestWithParams = (
  body: any,
  id: string,
  method: RequestMethod = "GET",
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
