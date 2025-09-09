"use client";
import React, { use, useEffect, useState } from "react";
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
  BellPlus,
  MessageCircle,
  Bookmark,
  Users,
  User,
  Ellipsis,
  Share2,
} from "lucide-react";
const Left = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return; // don’t run if no user yet

    const fetchUserid = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch /api/user");

        const { data } = await res.json();
        console.log("data from left:", data);

        const UserMongooID = data.find(
          (item: any) => item?.clerkId === user.id
        );

        console.log("matched user:", UserMongooID);

        setUserId(UserMongooID?._id || null);
      } catch (err) {
        console.error("fetchUserid error:", err);
      }
    };

    fetchUserid();
  }, [user]);

  const style = "flex  gap-4 p-3 rounded-4xl items-center text-xl ";
  const styleSpan = "hidden md:block";
  return (
    <div className="flex flex-row  md:flex-col md:w-[20%] border-[#2f3336] border-r-1   p-2">
      <div className="icons flex-1 flex md:flex-col md:gap-5 ">
        <div className="p-3">
          <Link href={"/"}>
            <Share2 size={35} />
          </Link>
        </div>
        <div className={style}>
          <House size={26} /> <span className={styleSpan}>Home</span>
        </div>
        <div className={style}>
          <Search size={29} /> <span className={styleSpan}>Search</span>
        </div>
        <div className={style}>
          <BellPlus size={29} />{" "}
          <span className={styleSpan}>Notifications</span>
        </div>
        <div className={style}>
          <MessageCircle size={29} />{" "}
          <span className={styleSpan}>Messages</span>
        </div>
        <div className={style}>
          <Bookmark size={29} /> <span className={styleSpan}>Bookmarks</span>
        </div>
        <div className={style}>
          <Link href={"/users"} className="flex flex-row gap-4 ">
            <Users size={29} /> <span className={styleSpan}>Users</span>
          </Link>
        </div>
        {user && userId && (
          <Link href={`/profile/${userId}`} className={style}>
            <User size={29} /> <span className={styleSpan}>Profile </span>
          </Link>
        )}
      </div>
      <div>
        <ClerkLoading>Loading...</ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <div className=" flex flex-col md:flex-row gap-1">
              <div
                className={`px-4 py-2 rounded-full bg-white  cursor-pointer  font-bold text-black transition-opacity duration-200`}
              >
                <SignInButton />
              </div>
              <div
                className={`px-4 py-2 rounded-full border-1 border-[#2f3336]  cursor-pointer  font-bold text-white transition-opacity duration-200`}
              >
                <SignUpButton />
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex p-2 gap-2 items-center ">
              <UserButton />
              <p className="flex flex-1 flex-col">
                <span className={styleSpan}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className={`text-sm text-gray-600  ${styleSpan} `}>
                  @{user?.username}
                </span>
              </p>

              <Ellipsis className={styleSpan} />
            </div>
          </SignedIn>
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Left;
