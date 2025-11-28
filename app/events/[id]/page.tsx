import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import { getEventById, getSimilarEventsById } from "@/lib/actions/event.actions";

export default async function EventDetailsPage({
                                                   params,
                                               }: {
    params: { id: string };
}) {
    // ⛔ пропускаем /events/edit
    if (params.id === "edit") return null;

    const event = await getEventById(params.id);
    if (!event) return notFound();

    const similarEvents = await getSimilarEventsById(event._id);

    return (
        <main>
            <EventDetails event={event} similarEvents={similarEvents} />
        </main>
    );
}
