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
    if (!user) return;

    const fetchUserid = async () => {
      try {
        const res = await fetch("/api/user");
        const { data } = await res.json();
        const UserMongooID = data.find(
          (item: any) => item?.clerkId === user.id
        );
        setUserId(UserMongooID?._id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserid();
  }, [user?.id]);

  const style = "flex  gap-4 p-3 rounded-4xl items-center text-xl ";
  const styleSpan = "hidden md:block";
  return (
    <div className="  md:w-[20%] border-[#2f3336] border-r-1   p-2 flex flex-col">
      <div className="icons flex-1 flex flex-col md:gap-5 ">
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
          <Users size={29} /> <span className={styleSpan}>Communities</span>
        </div>
        {user && (
          <Link href={`/profile/${userId}`} className={style}>
            <User size={29} /> <span className={styleSpan}>Profile </span>
          </Link>
        )}
      </div>
      <div>
        <ClerkLoading>Loading...</ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <SignInButton />
            <SignUpButton />
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
