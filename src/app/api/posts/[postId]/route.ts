import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import mongoose from "mongoose";
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params; // no await

  try {
    await connectDB();
    const { userId } = await req.json();

    const user = await User.findOne({ clerkId: userId });
    const userObjectId = new mongoose.Types.ObjectId(user?._id);
    const postToBeLiked = await Post.findById(postId);
    let updatedPost;

    if (postToBeLiked?.likes.includes(userObjectId)) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: user?._id } }, 
        { new: true } 
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: user?._id } },
        { new: true } 
      );
    }

    return NextResponse.json(updatedPost?.likes?.length);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  await connectDB();
  try {
    const { postId } = params;
    console.log("from delete", postId);

    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error deleting post:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
