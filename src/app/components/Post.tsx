"use client";
import React, { useState, useRef, useEffect } from "react";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import UploadImage from "@/lib/actions/UploadImage";

// The prop type for the parent component callback
type PostProps = {
  onPostCreated: () => void;
  postId: string;
  type: string;
};

const Post: React.FC<PostProps> = ({ onPostCreated, type, postId }) => {
  console.log("posts parentid", postId);
  const [postText, setPostText] = useState<string>("");
  const { user } = useUser();
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and create local preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle the file upload to ImageKit
  const handleUpload = async (): Promise<string | null> => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      console.log("No file selected");
      return null;
    }

    // ✅ Ensure it’s a real File before passing to UploadImage
    if (!(file instanceof File)) {
      console.error("Invalid file type:", file);
      return null;
    }

    const imageUrl = await UploadImage(file); // pass raw File, not object
    return imageUrl;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);

    try {
      const finalImageUrl = await handleUpload();

      if (postText || finalImageUrl) {
        const res = await fetch("/api/upload-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            imageUrl: finalImageUrl,
            postText,
            parentPostId: postId,
          }),
        });

        if (!res.ok) {
          console.error("❌ Error Posting");
        }
      }

      // Reset the form
      setPostText("");
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsPosting(false);

      // Notify the parent component
      onPostCreated();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setIsPosting(false);
    }
  };

  // Cleanup object URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formIsValid =
    postText.trim() !== "" || fileInputRef.current?.files?.[0];

  return (
    <div className="flex w-full border-b border-[#2f3336] flex-row items-start px-4 py-4 gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full gap-4">
        <div className="flex flex-row items-start gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={user?.imageUrl ?? "/path/to/default-avatar.png"}
              alt="User profile"
              fill
              className="object-cover"
              sizes="45 px"
            />
          </div>
          <input
            className=" text-white text-2xl outline-none bg-transparent flex-1 placeholder-gray-500 pt-2"
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={type}
          />
        </div>

        {previewUrl && (
          <div className="relative mt-2 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Image Preview"
              className="w-full max-h-[400px] object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex flex-row items-center justify-between px-3">
          <input
            id="file"
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className="  flex p-2 rounded-full cursor-pointer transition-colors duration-200"
          >
            <ImageUp /> <span className="text-gray-100 px-1 " >Upload Image</span>
          </label>
          <button
            type="submit"
            disabled={isPosting || !formIsValid}
            className={`px-4 py-2 rounded-full font-bold text-black transition-opacity duration-200 ${
              isPosting || !formIsValid
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-white  cursor-pointer "
            }`}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Post;
