"use client";
import { useEffect, useState } from "react";
import AddComment from "./AddComment";
import Image from "next/image";
import { EllipsisVertical, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
    updatedAt: string;
  };
}

interface CommentSectionProps {
  comments: Array<Comment>;
  addComment: (content: string) => void;
  deleteComment: (commentId: string) => void;
  fetchComments: (page: string) => void;
}

const CommentSection = ({
  comments,
  addComment,
  deleteComment,
  fetchComments,
}: CommentSectionProps): JSX.Element => {
  const [addCommentContent, setAddCommentContent] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [showEditableComment, setShowEditableComment] =
    useState<Comment | null>(null);

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
    fetchComments(page.toString());
  };

  useEffect(() => {
    if (addCommentContent.trim() !== "") {
      addComment(addCommentContent);
      setAddCommentContent("");
    }
    fetchComments(page.toString());
  }, [addCommentContent]);

  useEffect(() => {
    fetchComments(page.toString());
  }, [page]);

  useEffect(() => {
    if (comments.length === 0 && page > 1) {
      setPage((page) => page - 1);
    }
  }, [comments]);

  return (
    <div className="border p-2 flex flex-col gap-4 m-1 rounded-lg">
      <h1 className="text-2xl font-semibold text-center">Comments</h1>
      <AddComment setAddCommentContent={setAddCommentContent} />
      {comments?.map((comment: Comment) => (
        <div
          key={comment._id}
          className="bg-white p-2 space-y-2 rounded-sm text-black"
        >
          <div className="flex gap-4 items-center w-full">
            <Image
              src={comment.owner.avatar}
              alt="avatar"
              className="rounded-full flex-0"
              width={50}
              height={50}
            />
            <div className="flex flex-wrap flex-col w-full">
              <div className="flex gap-1">
                <span className="text-xs font-semibold text-gray-500">
                  @{comment.owner.username}
                </span>
                <span className="text-xs text-gray-700">
                  {new Date(comment.owner.updatedAt).toLocaleDateString(
                    "en-IN"
                  )}
                  {/* {dayjs(comment.owner.updatedAt).fromNow()} */}
                </span>
              </div>
              <p className="text-black break-all text-sm">{comment.content}</p>
              <div className="flex gap-2 items-center">
                <ThumbsUp size={12} />
                <ThumbsDown size={12} />
                <span className="text-xs text-gray-400 font-semibold">
                  Reply
                </span>
              </div>
            </div>

            <div className="justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setShowEditableComment(comment)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
      <Pagination>
        <PaginationContent className="justify-between w-full">
          <PaginationItem>
            <PaginationPrevious
              disabled={page === 1}
              variant="secondary"
              onClick={() => {
                if (page > 1) {
                  setPage((page) => page - 1);
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={comments.length < 10}
              variant="secondary"
              onClick={() => {
                if (comments.length === 10) {
                  setPage((page) => page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CommentSection;
