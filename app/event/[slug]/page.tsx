import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventWall } from "@/components/wall/event-wall";
import type { WallEventView } from "@/components/wall/wall-types";
import { getSessionPersonaId } from "@/lib/session";
import { getEventBySlug, getWallPage, isEventFeedbackClosed } from "@/lib/wall";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

async function loadEvent(slug: string) {
  return getEventBySlug(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await loadEvent(slug);
  return event ? { title: `${event.title} | PulseBox` } : { title: "Event not found | PulseBox" };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) {
    notFound();
  }

  const viewerPersonaId = await getSessionPersonaId();
  const wall = await getWallPage({
    eventId: event.id,
    viewerPersonaId,
    sort: "newest",
  });
  const eventView: WallEventView = {
    id: event.id,
    title: event.title,
    description: event.description,
    slug: event.slug,
    eventDate: event.event_date,
    feedbackDeadline: event.feedback_deadline,
    isOpen: event.is_open,
    isSuspended: event.is_suspended,
    isClosed: isEventFeedbackClosed(event),
  };

  return <EventWall event={eventView} initialItems={wall.items} initialCursor={wall.nextCursor} />;
}
