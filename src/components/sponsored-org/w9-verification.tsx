import { useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface W9VerificationProps {
  constructEmail: () => void;
}

export const W9Verification: React.FunctionComponent<W9VerificationProps> = ({ constructEmail }) => {
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Did you email the W9 form to Ecologistics?</DialogTitle>
        <DialogDescription>
          {`*This only applies to third-party payments. If this is a reimbursement, click "Yes" to continue.`}
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-between">
        {isDenied ? (
          <>
            <Button variant="secondary" className="bg-opacity-80" onClick={constructEmail}>
              Generate Email Template
            </Button>
            <Button
              className="w-[30%] bg-green-300 bg-opacity-80 text-green-800 hover:bg-green-300"
              onClick={() => setIsDenied(false)}
            >
              Done
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsDenied(true)}
              className="w-[30%] bg-red-400 bg-opacity-80 text-red-800 hover:bg-red-400"
            >
              No
            </Button>
            <Button
              type="submit"
              form="request-reimbursement-form"
              onClick={() => setSubmitDisabled(true)}
              disabled={submitDisabled}
              className="w-[30%] bg-green-300 bg-opacity-80 text-green-800 hover:bg-green-300"
            >
              Yes
            </Button>
          </>
        )}
      </div>
    </DialogContent>
  );
};
