"use client";
import React from "react";
import PostCard from "./PostCard";
const Feed = ({
  posts,
  fetchPosts,
}: {
  posts: any[];
  fetchPosts: () => void;
}) => {
  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post: any) => (
          <div key={post._id} className="border-b border-[#2f3336] p-4">
            <PostCard type="root" onPostCreated={fetchPosts} post={post} />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-medium">No Posts Yet</p>
          <p className="text-sm text-gray-400">
            Be the first to share something!
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;
