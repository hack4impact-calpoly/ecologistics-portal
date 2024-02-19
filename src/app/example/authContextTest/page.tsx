"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

// import { currentUser } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    fetch(`/api/user/${user?.id}/unsafemetadata`, {
      method: "GET",
    });
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }
  const emails = user?.emailAddresses?.map((email) => email.emailAddress);

  return (
    <div>
      <h1>Auth Context Test</h1>
      <p>{`User: ${user?.firstName} ${user?.lastName}`}</p>
      <p>{`Email: ${emails}`}</p>
      <p>{`Organization Name: ${user?.unsafeMetadata?.organization}`}</p>
    </div>
  );
}
