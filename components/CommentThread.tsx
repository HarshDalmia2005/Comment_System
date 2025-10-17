"use client";

import React, { useEffect, useState } from "react";
import { Comment, User } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface CommentThreadProps {
  comments: Comment[];
  users: User[];
  level?: number;
  parentId?: number | null;
}

const CommentNode: React.FC<{
  comment: Comment;
  users: User[];
  localComments: Comment[];
  setLocalComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  level: number;
}> =  ({ comment, users, localComments, setLocalComments, level }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  // const session = await getServerSession(authOptions);

  const user = users.find((u) => u.id === comment.user_id);
  const child = localComments.filter((c) => c.parent_id === comment.id);

  const onReply = async (parentIdArg: number, text: string) => {
    try {
      const newComment: Comment = {
        id: Date.now(),
        parent_id: parentIdArg,
        text,
        upvotes: 0,
        created_at: new Date().toISOString(),
        user_id: localStorage.getItem("id") || "" ,
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
      setLocalComments(c);
      setCollapsed(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };
  const onUpvote = async (id: number) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to upvote comment");
      }
      const commentsRes = await fetch("/api/comments");
      const c = await commentsRes.json();
      setLocalComments(c);
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-1">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="font-semibold">{user?.name ?? "Unknown"}</span>
        <span className="text-xs text-gray-500">
          {new Date(comment.created_at).toLocaleString("en-GB", {
            timeZone: "UTC",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>

      <p className="mb-0 pl-8 text-sm">{comment.text}</p>

      <div className="flex space-x-4 pl-8 text-sm mb-2">
        <button
          onClick={() => onUpvote(comment.id)}
          className="hover:underline"
        >
          Upvote {comment.upvotes}
        </button>
        <button
          onClick={() => setShowReply((s) => !s)}
          className="hover:underline"
        >
          Reply
        </button>
        {child.length > 0 && (
          <button
            onClick={() => setCollapsed((s) => !s)}
            className="hover:underline text-blue-400"
          >
            {collapsed
              ? `Show ${child.length} repl${child.length > 1 ? "ies" : "y"}`
              : `Hide repl${child.length > 1 ? "ies" : "y"}`}
          </button>
        )}
      </div>

      {showReply && (
        <div className="pl-8 mb-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border rounded-md text-[#988F2A] focus:outline-none focus:ring-0 text-sm"
          />
          <button
            onClick={() => {
              if (replyText.trim()) {
                onReply(comment.id, replyText.trim());
                setReplyText("");
                setShowReply(false);
                setCollapsed(false);
              }
            }}
            className="mt-1 px-3 py-1 bg-[#988F2A] text-[#322F20] rounded-md text-xs font-semibold hover:bg-[#B4A63C]"
          >
            Post Reply
          </button>
        </div>
      )}

      {!collapsed && (
        <CommentThread
          comments={localComments}
          users={users}
          parentId={comment.id}
          level={level + 1}
        />
      )}
    </div>
  );
};

const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  users,
  parentId = null,
  level = 0,
}) => {
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const curr = localComments.filter(
    (comment) => comment.parent_id === parentId,
  );

  if (curr.length === 0) return null;

  return (
    <div className={`${level > 0 ? "ml-8 border-l pl-4 border-gray-300" : ""}`}>
      {curr.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          users={users}
          localComments={localComments}
          setLocalComments={setLocalComments}
          level={level}
        />
      ))}
    </div>
  );
};

export default CommentThread;
