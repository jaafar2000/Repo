"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import fetchPosts from "@/lib/actions/fetchPosts";
import PostActions from "@/app/components/PostActions";
import Post from "@/app/components/Post";
import Feed from "@/app/components/Feed";
import { IPost } from "@/lib/models/Post"; // adjust import to your Post type
import Image from "next/image";
interface PostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

const Page = ({ params }: PostPageProps) => {
  const { postId } = use(params); // ✅ unwrap params
  const [post, setPost] = React.useState<any>(null);
  const [replies, setReplies] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchSinglePost = async () => {
      const data = await fetchPosts();
      const singlePost = data.find((p: any) => p._id === postId);

      setPost(singlePost);
    };
    fetchSinglePost();
  }, [postId]);

  // Fetch replies to this post
  const fetchReplies = async () => {
    const data = await fetchPosts();

    const filtered = data.filter((p: IPost) => {
      if (!p.parentPostId) return false;

      // parentPostId might be a string or an object with _id
      const parentId =
        typeof p.parentPostId === "string"
          ? p.parentPostId
          : p.parentPostId._id;
      return parentId === postId;
    });

    setReplies(filtered);
  };
  useEffect(() => {
    if (postId) fetchReplies();
  }, [postId]);

  // Format date
  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    // Replace first comma with middle dot
    return date.toLocaleString("en-US", options).replace(",", " ·");
  };

  return (
    <>
      {post ? (
        <div className="w-full h-screen overflow-y-scroll hide-scrollbar text-white">
          {/* HEADER */}
          <div className="sticky top-0 z-10 flex items-center border-b border-[#2f3336] py-4 text-xl font-bold backdrop-blur-[20px] backdrop-saturate-[180%] bg-black/60">
            <Link href="/" className="z-10">
              <ArrowLeft size={20} className="ml-4 mr-2 cursor-pointer" />
            </Link>
            <h2 className="px-3">Post</h2>
          </div>

          {/* POST CONTENT */}
          <div className="p-4 ">
            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={post.author?.image_url}
                alt="Author"
                className="w-10 h-10 rounded-full"
                width={100}
                height={100}
              />
              <div>
                <p className="font-bold">
                  {post.author?.first_name} {post.author?.last_name}
                </p>
                <p className="text-sm text-gray-400">
                  @{post.author?.username}
                </p>
              </div>
            </div>

            {/* Body */}
            <p className="mb-4 text-lg">{post.body}</p>

            {/* Image (if exists) */}
            {post.image && (
              <Image
                src={post.image}
                width={100}
                height={100}
                alt="Post media"
                className="w-full rounded-xl border border-[#2f3336] mb-4"
              />
            )}

            {/* Date */}
            <p className="text-sm text-gray-500 mb-4">
              {formatPostDate(post.createdAt)}
            </p>

            {/* Actions */}
            <div className=" flex items-center border-t-1 border-b-1   border-[#2f3336] bx-2">
              <PostActions
                repost={() => {
                  return;
                }}
                likes={post?.likes}
                _id={post?._id}
              />
            </div>
          </div>
          <span className="text-gray-600 ml-5">
            Replying to{" "}
            <span className="text-blue-500"> @{post.author?.username}</span>
          </span>
          <Post
            onPostCreated={fetchReplies}
            postId={postId}
            type={"Post Your Reply"}
          />

          <Feed posts={replies} fetchPosts={fetchReplies} />
        </div>
      ) : (
        <div>np p</div>
      )}
    </>
  );
};

export default Page;
