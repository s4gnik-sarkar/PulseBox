export type WallPersona = {
  id: string;
  nickname: string;
  avatarId: number;
};

export type WallItem = {
  id: string;
  message: string;
  category: "experience" | "suggestion" | "issue";
  mood: "fire" | "love" | "happy" | "meh" | "sad" | "angry";
  rating: number | null;
  createdAt: string;
  persona: WallPersona;
  replyCount: number;
  reactions: Record<"love" | "fire" | "laugh" | "clap" | "chai", number>;
  mine: string[];
  isMine: boolean;
};

export type WallReply = {
  id: string;
  message: string;
  createdAt: string;
  persona: WallPersona;
};
