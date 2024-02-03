"use client";

import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MyComponentProps {
  children: React.ReactNode;
}

const CollapsibleRowWrapper: React.FC<MyComponentProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer", borderBottom: "1px solid #ccc" }}
      >
        {children}
      </div>
      {/* Collapsible content */}
      {!isOpen && (
        <div style={{ padding: "8px", backgroundColor: "#f5f5f5" }}>
          {/* Your collapsible content goes here */}
          <p>Collapsible Content</p>
        </div>
      )}
    </div>
  );
};

export default CollapsibleRowWrapper;
