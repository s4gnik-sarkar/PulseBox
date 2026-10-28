export const MOODS = [
  { key: "fire", emoji: "🔥", label: "Fire" },
  { key: "love", emoji: "😍", label: "Loved it" },
  { key: "happy", emoji: "😄", label: "Happy" },
  { key: "meh", emoji: "😐", label: "Meh" },
  { key: "sad", emoji: "😞", label: "Sad" },
  { key: "angry", emoji: "😡", label: "Frustrated" },
] as const;

export const CATEGORIES = [
  { key: "experience", label: "Experience" },
  { key: "suggestion", label: "Suggestion" },
  { key: "issue", label: "Issue" },
] as const;

export const REACTIONS = [
  { key: "love", emoji: "❤️" },
  { key: "fire", emoji: "🔥" },
  { key: "laugh", emoji: "😂" },
  { key: "clap", emoji: "👏" },
  { key: "chai", emoji: "☕" },
] as const;

export const REPORT_REASONS = [
  { key: "spam", label: "Spam" },
  { key: "abuse", label: "Abuse" },
  { key: "hate", label: "Hate" },
  { key: "personal_info", label: "Personal information" },
  { key: "other", label: "Other" },
] as const;

export const FEEDBACK_MAX = 1000;
export const REPLY_MAX = 500;

export const PROMPTS = [
  "What was the biggest W of this event?",
  "What should we fix before next time?",
  "What would make the next event legendary?",
] as const;

export type MoodKey = (typeof MOODS)[number]["key"];
export type CategoryKey = (typeof CATEGORIES)[number]["key"];
export type ReactionKey = (typeof REACTIONS)[number]["key"];
export type ReportReasonKey = (typeof REPORT_REASONS)[number]["key"];
