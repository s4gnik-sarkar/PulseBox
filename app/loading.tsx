export default function Loading() {
  return (
    <main
      role="status"
      aria-label="Loading PulseBox"
      className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground"
    >
      <div className="sticker flex items-center gap-4 rounded-3xl bg-card px-7 py-5">
        <span
          aria-hidden="true"
          className="size-8 animate-spin rounded-full border-4 border-plum/20 border-t-hot dark:border-lilac/30 dark:border-t-hot"
        />
        <span className="font-marker text-2xl">pulsebox</span>
      </div>
    </main>
  );
}
