import { getEventById } from "@/lib/actions/event.actions";
import EventForm from "@/components/EventForm";

interface PageProps {
    params: { id: string };
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = params;

    const event: any = await getEventById(id);

    if (!event) {
        return (
            <div className="p-10">
                <h1 className="text-3xl font-bold text-red-500">Event not found</h1>
            </div>
        );
    }

    // ⬇️ ОЧЕНЬ ВАЖНО — НЕ ТРОГАЕМ ТИП IEvent, просто делаем копию
    const safeEvent = {
        ...event,
        _id: event._id?.toString(),
        createdAt: event.createdAt ? event.createdAt.toString() : "",
        updatedAt: event.updatedAt ? event.updatedAt.toString() : "",
    };

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
            <EventForm type="edit" event={safeEvent} />
        </main>
    );
}
