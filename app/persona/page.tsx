import { PersonaPage } from "@/components/persona/persona-page";

type PageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function getSafeNextPath(value: string | string[] | undefined): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return "/event/demo";
  }

  try {
    const destination = new URL(value, "https://pulsebox.invalid");
    if (destination.origin !== "https://pulsebox.invalid" || destination.pathname.startsWith("//")) {
      return "/event/demo";
    }
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/event/demo";
  }
}

export default async function Page({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return <PersonaPage nextPath={getSafeNextPath(next)} />;
}
