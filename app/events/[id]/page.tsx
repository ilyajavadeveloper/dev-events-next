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
    // ⛔ Пропускаем /events/edit
    if (params.id === "edit") return null;

    await connectDB();

    const event = await Event.findById(params.id).lean();

    if (!event) return notFound();

    // 💥 FIX: event as any
    const e = event as any;

    const safeEvent = {
        ...e,
        _id: e._id.toString(),
        createdAt: e.createdAt?.toString() ?? "",
        updatedAt: e.updatedAt?.toString() ?? "",
    };

    const similarEvents = await getSimilarEventsById(safeEvent._id);

    return (
        <main>
            <EventDetails event={safeEvent} similarEvents={similarEvents} />
        </main>
    );
}
