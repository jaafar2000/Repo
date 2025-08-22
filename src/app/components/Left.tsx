import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
const Left = () => {
  return (
    <div className="w-1/5 border-r-1 border-gray-100 ">
      <ClerkLoading>Loading...</ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
};

export default Left;
