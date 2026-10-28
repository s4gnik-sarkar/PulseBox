import type { WallItem, WallReply } from "@/lib/wall-types";

export type { WallItem, WallReply };

export type WallEventView = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  eventDate: string | null;
  feedbackDeadline: string | null;
  isOpen: boolean;
  isClosed: boolean;
};
