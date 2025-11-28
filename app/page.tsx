import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import { getSimilarEventsById } from "@/lib/actions/event.actions";

export default async function EventDetailsPage({
                                                   params,
                                               }: {
    params: { id: string };
}) {
    const id = params.id;

    await connectDB();

    const event = await Event.findById(id).lean();
    if (!event) return notFound();

    // 💥 FIX: вырезаем вариант массива
    const doc = event as any;

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
