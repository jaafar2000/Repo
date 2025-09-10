"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import {
  House,
  Search,
  MessageCircle,
  Users,
  User,
  Ellipsis,
  Share2,
} from "lucide-react";

const Left = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUser();
  const [active, setActive] = useState<string>("Home");

  useEffect(() => {
    if (!user) return;

    const fetchUserid = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch /api/user");

        const { data } = await res.json();
        const UserMongooID = data.find(
          (item: any) => item?.clerkId === user.id
        );
        setUserId(UserMongooID?._id || null);
      } catch (err) {
        console.error("fetchUserid error:", err);
      }
    };

    fetchUserid();
  }, [user]);

  const style =
    "flex gap-3 md:gap-4 p-2 md:p-3 items-center text-lg md:text-xl text-gray-400 w-fit cursor-pointer hover:text-white transition-colors rounded-md";
  const styleSpan = "hidden md:block";
  const styleActive = "text-white";

  return (
    <div className="flex    md:flex-col w-full md:w-[20%] border-r border-[#2f3336] p-2 md:p-4">
      {/* Top Icons */}
      <div className="flex md:flex-col md:gap-6 flex-row gap-4 flex-1 items-center md:items-start justify-center md:justify-start">
        <div className="p-1 md:p-3 cursor-pointer hover:bg-gray-700 rounded-full">
          <Link href={"/"}>
            <Share2 size={30} />
          </Link>
        </div>

        {/* Menu Items */}
        <Link href={"/"}>
          <div
            className={`${style} ${active === "Home" ? styleActive : ""}`}
            onClick={() => setActive("Home")}
          >
            <House size={26} /> <span className={styleSpan}>Home</span>
          </div>
        </Link>

        <Link href={"/search"}>
          <div
            className={`${style} ${active === "Search" ? styleActive : ""}`}
            onClick={() => setActive("Search")}
          >
            <Search size={26} /> <span className={styleSpan}>Search</span>
          </div>
        </Link>

        <div
          className={`${style} ${active === "Messages" ? styleActive : ""}`}
          onClick={() => setActive("Messages")}
        >
          <MessageCircle size={26} />{" "}
          <span className={styleSpan}>Messages</span>
        </div>

        <Link
          href={"/users"}
          className={`${style} ${active === "Users" ? styleActive : ""}`}
          onClick={() => setActive("Users")}
        >
          <Users size={26} /> <span className={styleSpan}>Users</span>
        </Link>

        {user && userId && (
          <Link
            href={`/profile/${userId}`}
            className={`${style} ${active === "Profile" ? styleActive : ""}`}
            onClick={() => setActive("Profile")}
          >
            <User size={26} />
            <span className={styleSpan}>Profile</span>
          </Link>
        )}

        <Link
          href={"/create-post"}
          className="bg-white w-full text-black text-center font-bold py-2 rounded-3xl"
        >
          Post
        </Link>
      </div>

      {/* Auth Buttons / User Info */}
      <div className="mt-2 md:mt-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
        <ClerkLoading>Loading...</ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="px-4 py-2 rounded-full bg-white cursor-pointer font-bold text-black text-center">
                <SignInButton />
              </div>
              <div className="px-4 py-2 rounded-full border border-[#2f3336] cursor-pointer font-bold text-white text-center">
                <SignUpButton />
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-0">
              <UserButton />
              <div className="flex flex-col">
                <span className={styleSpan}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className={`text-sm text-gray-500 ${styleSpan}`}>
                  @{user?.username}
                </span>
              </div>
              <Ellipsis className={`text-gray-400 ${styleSpan}`} />
            </div>
          </SignedIn>
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Left;
