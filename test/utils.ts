import Alert from "@/database/alert-schema";
import Reimbursement from "@/database/reimbursement-schema";
import { createMocks } from "node-mocks-http";

export const createMockNextRequest = (body: any) =>
  createMocks({
    json: () => Promise.resolve(body),
  });

export const createMockFormDataRequest = (body: any) => {
  const { req, res } = createMocks({
    body,
  });

  // Convert body to map for FormData
  const formData = body ? new Map(Object.entries(body)) : null;

  // Mock req.formData to simulate form data parsing
  req.formData = async () => Promise.resolve(formData);

  return { req, res };
};

export const formatMockReimbursementResponse = (reimbursement: Reimbursement) => ({
  ...reimbursement,
  transactionDate: reimbursement.transactionDate.toISOString(), // Standardize date format
});

export const formatMockReimbursementsResponse = (reimbursements: Reimbursement[]) =>
  reimbursements.map(formatMockReimbursementResponse);

export const formatMockAlertResponse = (alert: Alert) => ({
  ...alert,
  date: alert.date.toISOString(), // Standardize date format
});

export const formatMockAlertsResponse = (alerts: Alert[]) => alerts.map(formatMockAlertResponse);
