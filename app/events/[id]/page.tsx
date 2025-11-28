import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import { getSimilarEventsById, SafeEvent } from "@/lib/actions/event.actions";

export default async function EventDetailsPage({
                                                   params,
                                               }: {
    params: { id: string };
}) {
    await connectDB();

    const doc = await Event.findById(params.id).lean<any>();

    if (!doc) return notFound();

    const event: SafeEvent = {
        _id: doc._id.toString(),
        title: doc.title ?? "",
        description: doc.description ?? "",
        overview: doc.overview ?? "",
        venue: doc.venue ?? "",
        location: doc.location ?? "",
        date: doc.date ?? "",
        time: doc.time ?? "",
        mode: doc.mode ?? "",
        audience: doc.audience ?? "",
        organizer: doc.organizer ?? "",
        image: doc.image ?? "",
        tags: Array.isArray(doc.tags) ? doc.tags : [],
        agenda: Array.isArray(doc.agenda) ? doc.agenda : [],
        createdAt: doc.createdAt?.toString() ?? "",
        updatedAt: doc.updatedAt?.toString() ?? "",
    };

    const similarEvents = await getSimilarEventsById(event._id);

    return (
        <main>
            <EventDetails event={event} similarEvents={similarEvents} />
        </main>
    );
}
