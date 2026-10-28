import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="sticker w-full max-w-lg rounded-[2rem] bg-butter p-8 text-center">
        <p className="font-hand text-5xl text-plum">Oops!</p>
        <h1 className="mt-2 text-3xl font-extrabold text-plum">This event wandered off.</h1>
        <p className="mt-3 text-plum">That feedback wall could not be found.</p>
        <Link
          href="/"
          className="sticker press mt-6 inline-block rounded-full bg-mint px-6 py-3 font-bold text-plum"
        >
          Back to PulseBox
        </Link>
      </section>
    </main>
  );
}
