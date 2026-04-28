"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { Comment } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  depth?: number;
}

function CommentItem({ comment, replies, depth = 0 }: CommentItemProps) {
  const { currentUser, users, likeComment, addComment } = useStore();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const author = users.find((u) => u.id === comment.userId);
  const hasLiked = currentUser ? comment.likes.includes(currentUser.id) : false;
  const isMe = currentUser?.id === comment.userId;

  const handleReply = () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addComment(comment.eventId, replyText.trim(), comment.id);
      setReplyText("");
      setReplyOpen(false);
      setSubmitting(false);
      setShowReplies(true);
    }, 300);
  };

  if (!author) return null;

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-8 pl-3 border-l border-dark-600")}>
      <Avatar className="h-7 w-7 shrink-0 mt-0.5 border border-dark-500">
        <AvatarImage src={author.avatar} />
        <AvatarFallback className="text-[9px] bg-edg-gradient text-white font-bold">
          {getInitials(author.firstName, author.lastName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="rounded-2xl rounded-tl-sm bg-dark-700/80 border border-dark-500 px-3.5 py-2.5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className={cn("text-xs font-black", isMe ? "text-edg-300" : "text-zinc-200")}>
              {author.firstName} {author.lastName}
              {isMe && <span className="ml-1 text-edg-500 font-normal">· Toi</span>}
            </span>
            <span className="text-[10px] text-zinc-600">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1.5 ml-1">
          <button
            onClick={() => likeComment(comment.id)}
            className={cn(
              "flex items-center gap-1 text-[11px] font-semibold transition-colors",
              hasLiked ? "text-red-400" : "text-zinc-600 hover:text-red-400"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5 transition-all", hasLiked && "fill-current scale-110")} />
            {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
            <span className="sr-only">J'aime</span>
          </button>

          {depth === 0 && (
            <button
              onClick={() => setReplyOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-edg-400 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Répondre
            </button>
          )}

          {replies.length > 0 && depth === 0 && (
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {replies.length} réponse{replies.length > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Reply input */}
        {replyOpen && (
          <div className="flex gap-2 mt-2 ml-1">
            <Avatar className="h-6 w-6 shrink-0 mt-1 border border-dark-500">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="text-[8px] bg-edg-gradient text-white font-bold">
                {getInitials(currentUser?.firstName ?? "", currentUser?.lastName ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2 items-center rounded-xl border border-dark-500 bg-dark-700 px-3 py-1.5 focus-within:border-edg-500/40 transition-colors">
              <input
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder={`Répondre à ${author.firstName}…`}
                className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none"
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || submitting}
                className="text-edg-400 disabled:text-zinc-700 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-2 space-y-3">
            {replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} replies={[]} depth={1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentsSectionProps {
  eventId: string;
}

export function CommentsSection({ eventId }: CommentsSectionProps) {
  const { currentUser, comments, addComment } = useStore();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const eventComments = comments.filter((c) => c.eventId === eventId);
  const topLevel = eventComments.filter((c) => !c.parentId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addComment(eventId, text.trim());
      setText("");
      setSubmitting(false);
    }, 300);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
        <MessageCircle className="h-3.5 w-3.5" />
        Commentaires
        {eventComments.length > 0 && (
          <span className="rounded-full bg-dark-600 border border-dark-500 px-2 py-0.5 text-[10px] text-zinc-500 font-bold">
            {eventComments.length}
          </span>
        )}
      </h3>

      {/* New comment input */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-dark-500">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback className="text-[9px] bg-edg-gradient text-white font-bold">
            {getInitials(currentUser.firstName, currentUser.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center gap-2 rounded-2xl border border-dark-500 bg-dark-700/80 px-4 py-2.5 focus-within:border-edg-500/40 transition-colors">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Ajouter un commentaire…"
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="text-edg-400 disabled:text-zinc-700 transition-colors shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comment list */}
      {topLevel.length > 0 ? (
        <div className="space-y-4">
          {topLevel.map((comment) => {
            const replies = eventComments
              .filter((c) => c.parentId === comment.id)
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            return <CommentItem key={comment.id} comment={comment} replies={replies} />;
          })}
        </div>
      ) : (
        <p className="text-xs text-zinc-600 text-center py-4">Aucun commentaire pour l'instant. Sois le premier !</p>
      )}
    </div>
  );
}
