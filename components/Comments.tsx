"use client";
import React from "react";
import CommentThread from "./CommentThread";
import { Comment, User } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const Comments = () => {
  const [commentsData, setCommentsData] = React.useState<Comment[]>([]);
  const [usersData, setUsersData] = React.useState<User[]>([]);
  const [replyText, setReplyText] = React.useState<string>("");
  // const session = await getServerSession(authOptions);

  // console.log(session?.user);

  const fetchData = async () => {
    try {
      const commentsRes = await fetch("/api/comments");
      const usersRes = await fetch("/api/users");
      const commentsJson = await commentsRes.json();
      const usersJson = await usersRes.json();
      setCommentsData(commentsJson);
      setUsersData(usersJson);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onReply = async (text: string) => {
    try {
      const newComment: Comment = {
        id: Date.now(),
        parent_id: null,
        text,
        upvotes: 0,
        created_at: new Date().toISOString(),
        user_id: localStorage.getItem("id") || "",
      };

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error posting comment:", data.error);
        return;
      }

      const commentsRes = await fetch("/api/comments");
      const c = await commentsRes.json();
      setCommentsData(c);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full  flex flex-col items-start justify-start p-4 bg-[#322F20] text-[#988F2A] rounded-lg shadow-md space-y-4 mt-4">
      <h1 className="font-bold text-lg shadow-2xl p-2">Comments</h1>
      <div className="w-full flex">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full pt-1 pb-0  border-b border-[#988F2A] text-sm focus:outline-none focus:ring-0"
        />
        <button
          onClick={() => {
            if (replyText.trim()) {
              onReply( replyText.trim());
              setReplyText("");
            }
          }}
          className="mt-1 mx-3 px-3 py-1 bg-[#988F2A] text-[#322F20] rounded-md text-xs font-semibold hover:bg-[#B4A63C]"
        >
          {">"}
        </button>
      </div>
      <div className="flex flex-col space-y-2">
        <CommentThread users={usersData} comments={commentsData} />
      </div>
    </div>
  );
};

export default Comments;
