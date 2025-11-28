import EventDetails from "@/components/EventDetails";
import { getEventById, getSimilarEventsById } from "@/lib/actions/event.actions";
import connectDB from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // 💥 ВАЖНО: распаковываем Promise

    await connectDB();

    const event = await getEventById(id);
    if (!event) return notFound();

    const similarEvents = await getSimilarEventsById(event._id);

    return (
        <main>
            <EventDetails event={event} similarEvents={similarEvents} />
        </main>
    );
}
