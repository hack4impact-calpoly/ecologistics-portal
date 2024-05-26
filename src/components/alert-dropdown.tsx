"use client";
import useSWR from "swr";
import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { BellIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "components/ui/dropdown-menu";
import NewUserButton from "./user-button";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

// Alert component on header
export default function AlertIcon() {
  const { isSignedIn } = useUser();
  const [hasNewUpdates, setHasNewUpdates] = useState(true); // Assume there are new updates initially

  const { data, error, mutate } = useSWR(
    isSignedIn ? `/api/alert` : null,
    (...args) => fetch(...args).then((res) => res.json()),
  );

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alert/${alertId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch reimbursement");
      }
      mutate();
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };

  const handleDropdownOpen = () => {
    setHasNewUpdates(false); // Resets the new updates state when dropdown is opened
  };
  // Show if logged in
  if (isSignedIn) {
    return (
      <div className="z-10">
        <div className="flex space-x-4">
          <DropdownMenu onOpenChange={handleDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button>
                <div className="relative">
                  <BellIcon className="w-6 h-6" />
                  {hasNewUpdates && <span className="badge"></span>}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="right-0">
              <DropdownMenuLabel>Recent Updates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {data &&
                !error &&
                data.map(
                  (
                    alert: {
                      title: string;
                      description: string;
                      _id: string;
                    },
                    index: number,
                  ) => (
                    <DropdownMenuItem key={index}>
                      <div className="flex flex-row w-full justify-between items-center">
                        <div>
                          <div>{alert.title}</div>
                          <div>
                            {alert.description
                              .split("\n")
                              .map((line, index) => (
                                <div key={index}>{line}</div>
                              ))}
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 flex justify-center items-center rounded-lg ml-3 hover:bg-red-400"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event propagation to parent elements
                              handleDeleteAlert(alert._id); // Call delete handler function
                            }}
                          >
                            <Cross2Icon />
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ),
                )}
            </DropdownMenuContent>
          </DropdownMenu>
          <NewUserButton />
        </div>
        <style jsx>{`
          .badge {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 50%;
          }
        `}</style>
      </div>
    );
  }
  // Hide if logged out
  else {
    return null;
  }
}
