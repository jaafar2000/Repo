"use client";

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  ChartNoAxesColumn,
  Bookmark,
  CircleX,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { IPost } from "@/lib/models/Post";
import { IUser } from "@/lib/models/User";

interface Props {
  likes?: (IUser | string)[]; // can be populated IUser or ObjectId string
  _id: string;
  comments?: IPost[];
  repost?: () => void;
  setRepost?: (text: string) => void;
  noOfRepostedTime?: number;
}

const PostActions: React.FC<Props> = ({
  _id,
  repost,
  setRepost,
  comments = [],
  noOfRepostedTime,
}) => {
  const { user } = useUser();

  const [likesCount, setLikesCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, postId: _id }),
      });

      if (!res.ok) {
        console.error("❌ Error liking post");
        return;
      }

      const data = await res.json();
      console.log(data);
      setLikesCount(data);
      console.log(data);
    } catch (error) {
      console.error("Error in toggleLike:", error);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-40" onClick={closeModal} />
      )}

      <div className="icons text-sm text-gray-400 py-2 flex justify-between w-full">
        {/* Comments */}
        <div className="flex flex-row gap-2 items-center cursor-pointer">
          <MessageCircle size={20} /> <span>{comments.length}</span>
        </div>

        {/* Repost */}
        <button
          className="flex gap-2 items-center cursor-pointer"
          onClick={openModal}
        >
          <Repeat2 size={20} />
          <span> {noOfRepostedTime} </span>
        </button>

        {/* Likes */}
        <div
          className="flex flex-row gap-2 items-center cursor-pointer"
          onClick={toggleLike}
        >
          <Heart size={20} />
          <span className={"text-white"}>{likesCount}</span>
        </div>

        {/* Stats (dummy for now) */}
        <div className="flex flex-row gap-2 items-center">
          <ChartNoAxesColumn size={20} /> <span>5.7K</span>
        </div>

        {/* Bookmark */}
        <div className="flex flex-row gap-2 items-center cursor-pointer">
          <Bookmark size={20} />
        </div>
      </div>

      {/* Repost Modal */}
      {isOpen && (
        <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-black border-1 border-[#2f3336] rounded-xl p-6 shadow-lg">
          <div className="flex justify-end">
            <CircleX
              size={24}
              className="cursor-pointer hover:text-red-500"
              onClick={closeModal}
            />
          </div>
          <h2 className="text-lg font-semibold text-white mb-4">Repost</h2>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              repost?.();
              closeModal();
            }}
          >
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full p-3 rounded-lg bg-black border border-[#2f3336] text-white focus:outline-none focus:border-white"
              onChange={(e) => setRepost?.(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-100 hover:bg-white text-black cursor-pointer transition-colors  py-2 rounded-lg font-medium"
            >
              Repost
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default PostActions;
