import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import { getSimilarEventsById } from "@/lib/actions/event.actions";

export default async function EventDetailsPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params; // ✅ await params

    await connectDB();

    const doc = (await Event.findById(id).lean()) as any;
    if (!doc) return notFound();

    const safeEvent = {
        ...doc,
        _id: String(doc._id),
        createdAt: doc.createdAt?.toString() ?? "",
        updatedAt: doc.updatedAt?.toString() ?? "",
    };

    const similarEvents = await getSimilarEventsById(safeEvent._id);

    return (
        <main>
            <EventDetails event={safeEvent} similarEvents={similarEvents} />
        </main>
    );
}
