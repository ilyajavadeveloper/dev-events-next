import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
    await connectDB();

    const event = await Event.findById(params.id).lean();

    if (!event) return notFound();

    const safeEvent = {
        ...event,
        _id: event._id.toString(),
        createdAt: event.createdAt?.toString() ?? "",
        updatedAt: event.updatedAt?.toString() ?? "",
    };

    return (
        <main>
            <EventDetails event={safeEvent} />
        </main>
    );
}
