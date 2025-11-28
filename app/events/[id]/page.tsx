import { getEventById } from "@/lib/actions/event.actions";
import EventForm from "@/components/EventForm";

interface PageProps {
    params: { id: string }; // ❗ обычный объект
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = params; // ❗ убираем await, params не Promise

    console.log("EDIT PARAM ID =", id);

    const event = await getEventById(id);

    if (!event) {
        console.log("EVENT NOT FOUND BY ID =", id);
        return (
            <div className="p-10">
                <h1 className="text-3xl font-bold text-red-500">Event not found</h1>
            </div>
        );
    }

    const safeEvent = {
        ...event,
        _id: event._id.toString(),
        createdAt: event.createdAt ? String(event.createdAt) : "",
        updatedAt: event.updatedAt ? String(event.updatedAt) : "",
    };

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
            <EventForm type="edit" event={safeEvent} />
        </main>
    );
}
