"use client";

import { useState } from "react";
import { Doodle } from "@/components/doodles";
import { CATEGORIES, MOODS } from "@/lib/feedback-config";
import type { Persona } from "@/hooks/use-persona";
import type { WallItem } from "./wall-types";
import { RelativeTime } from "./relative-time";
import { ReactionBar } from "./reaction-bar";
import { ReplyThread } from "./reply-thread";
import { ReportMenu } from "./report-menu";
import { DeleteContentButton } from "./delete-content-button";

export function FeedbackCard({
  item,
  persona,
  onReactionChange,
  onReplyCountChange,
  onDelete,
  onOpen,
  compact = false,
  selected = false,
  defaultOpenThread = false,
}: {
  item: WallItem;
  persona: Persona | null;
  onReactionChange: (id: string, reactions: WallItem["reactions"], mine: string[]) => void;
  onReplyCountChange: (id: string, count: number) => void;
  onDelete: (id: string) => void;
  onOpen?: (id: string) => void;
  compact?: boolean;
  selected?: boolean;
  defaultOpenThread?: boolean;
}) {
  const [replyCount, setReplyCount] = useState(item.replyCount);
  const mood = MOODS.find((option) => option.key === item.mood);
  const category = CATEGORIES.find((option) => option.key === item.category);
  const isMine = persona?.id === item.persona.id || item.isMine;

  function updateReplyCount(count: number) {
    setReplyCount(count);
    onReplyCountChange(item.id, count);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onOpen?.(item.id)}
        className={`sticker block w-[min(78vw,380px)] min-w-[260px] shrink-0 rounded-[1.75rem] bg-card p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${selected ? "ring-4 ring-plum dark:ring-lilac" : ""} ${isMine ? "border-4 border-lilac" : ""}`}
      >
        <div className="flex items-center gap-3">
          <Doodle kind={item.persona.avatarId} className="size-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-bold">{item.persona.nickname}</span>
              {isMine && <span className="rounded-full bg-lilac px-2 py-0.5 text-[10px] font-bold text-plum">you</span>}
            </div>
            <span className="text-[11px] text-muted-foreground"><RelativeTime date={item.createdAt} /></span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-plum">
          <span className="rounded-full bg-peach px-2 py-1">{category?.label ?? item.category}</span>
          <span className="rounded-full bg-butter px-2 py-1">{mood?.emoji} {mood?.label}</span>
        </div>

        <p className="mt-3 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
          {item.message}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>{Object.values(item.reactions).reduce((total, value) => total + value, 0)} reactions</span>
          <span>{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
        </div>
      </button>
    );
  }

  return (
    <article className={`sticker rounded-[1.5rem] bg-card p-4 sm:p-5 ${selected || isMine ? "border-4 border-lilac" : ""}`}>
      <div className="flex items-start gap-3">
        <Doodle kind={item.persona.avatarId} className="size-12 shrink-0 sm:size-14" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="max-w-full break-words font-bold">{item.persona.nickname}</h3>
            {isMine && <span className="rounded-full bg-lilac px-2 py-0.5 text-xs font-bold text-plum">you</span>}
            <span className="text-xs text-muted-foreground"><RelativeTime date={item.createdAt} /></span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-peach px-2.5 py-1 text-xs font-bold text-plum">
              {category?.label ?? item.category}
            </span>
            <span className="rounded-full bg-butter px-2.5 py-1 text-xs font-bold text-plum">
              {mood?.emoji} {mood?.label}
            </span>
            {item.rating !== null && (
              <span aria-label={`${item.rating} out of 5 stars`} className="text-sm text-plum dark:text-butter">
                {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isMine && (
            <DeleteContentButton
              target="feedback"
              id={item.id}
              onDeleted={() => onDelete(item.id)}
            />
          )}
          <ReportMenu target="feedback" id={item.id} />
        </div>
      </div>

      <p className="my-4 whitespace-pre-wrap break-words text-base leading-relaxed">{item.message}</p>

      <div className="space-y-3">
        <ReactionBar
          feedbackId={item.id}
          persona={persona}
          initialCounts={item.reactions}
          initialMine={item.mine}
          onChange={(reactions, mine) => onReactionChange(item.id, reactions, mine)}
        />
        <ReplyThread
          feedbackId={item.id}
          initialCount={replyCount}
          persona={persona}
          onCountChange={updateReplyCount}
          defaultOpen={defaultOpenThread}
        />
      </div>
    </article>
  );
}
