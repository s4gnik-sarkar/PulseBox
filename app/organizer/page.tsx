import Link from "next/link";

export default function OrganizerPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="font-hand text-lg text-plum underline underline-offset-4 dark:text-cream">
          ← PulseBox home
        </Link>

        <section className="sticker mt-6 rounded-[2rem] bg-card p-6 sm:p-8">
          <p className="font-hand text-xl text-plum dark:text-lilac">For hosts</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Launch your event wall</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Organizer tools are on the roadmap. For now, hop into the demo event and test the feedback flow with a live wall.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/event/demo"
              className="sticker press rounded-full bg-hot px-6 py-3 text-center font-extrabold text-white"
            >
              Try the demo wall
            </Link>
            <Link
              href="/persona"
              className="sticker press rounded-full bg-cream px-6 py-3 text-center font-extrabold text-plum"
            >
              Make a persona
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
