import "server-only";

export function sanitizeMessage(input: unknown, max: number): string | null {
  if (typeof input !== "string") {
    return null;
  }

  const message = input
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, "")
    .trim()
    .replace(/\n{3,}/g, "\n\n");

  return message.length > 0 && message.length <= max ? message : null;
}
