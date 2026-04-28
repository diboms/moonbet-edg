"use client";

import { Linkedin } from "lucide-react";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UserLinkProps {
  user: User;
  showAvatar?: boolean;
  showCompany?: boolean;
  size?: "sm" | "md";
  className?: string;
  isMe?: boolean;
}

export function UserLink({ user, showAvatar = true, showCompany = false, size = "md", className, isMe }: UserLinkProps) {
  const name = `${user.firstName} ${user.lastName}`;
  const avatarSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  const content = (
    <div className={cn("flex items-center gap-2.5 group/user", className)}>
      {showAvatar && (
        <Avatar className={cn(avatarSize, "border border-dark-500 shrink-0")}>
          <AvatarImage src={user.avatar} />
          <AvatarFallback className={cn("bg-edg-gradient text-white font-bold", size === "sm" ? "text-xs" : "text-xs")}>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "font-bold truncate transition-colors",
            size === "sm" ? "text-xs" : "text-sm",
            isMe ? "text-edg-300" : "text-zinc-200",
            user.linkedin && "group-hover/user:text-[#0A66C2]"
          )}>
            {name}
            {isMe && <span className="text-zinc-500 font-normal ml-1">(toi)</span>}
          </span>
          {user.linkedin && (
            <Linkedin className={cn(
              "shrink-0 text-zinc-600 transition-colors group-hover/user:text-[#0A66C2]",
              size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"
            )} />
          )}
        </div>
        {showCompany && (
          <p className="text-xs text-zinc-600 truncate">{user.company}</p>
        )}
      </div>
    </div>
  );

  if (user.linkedin) {
    return (
      <a
        href={user.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={`Voir le profil LinkedIn de ${name}`}
        className="cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
}
