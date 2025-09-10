  "use client";
  import React, { useState, useEffect } from "react";
  import Post from "./components/Post";
  import Feed from "./components/Feed";
  import fetchPosts from "@/lib/actions/fetchPosts";
  import { IPost } from "@/lib/models/Post"; // adjust import to your Post type

  const Page = () => {
    const [posts, setPosts] = useState<IPost[]>([]);

    const fetch = async () => {
      const posts = await fetchPosts();
      setPosts(posts);
    };

    useEffect(() => {
      fetch();
    }, []);

    return (
      <div className="w-full h-screen overflow-y-scroll hide-scrollbar">
        <div className="sticky top-0 z-10 flex items-center border-b-1 border-[#2f3336] py-4 text-xl font-bold backdrop-blur-[20px] backdrop-saturate-[180%] bg-black/60">
          <h2 className="text-white px-3">Feed</h2>
        </div>
        <Post onPostCreated={fetch} postId={""}  type={"What's happening?"} key={"post-feed"} />
        <Feed posts={posts} fetchPosts={fetch} />
      </div>
    );
  };

  export default Page;
