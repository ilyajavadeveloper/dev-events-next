import { getEventById } from "@/lib/actions/event.actions";
import EventForm from "@/components/EventForm";
import { Types } from "mongoose";

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const id = params.id;

    // Ловим оба варианта ID
    const event = await getEventById(id);

    if (!event) {
        console.log("❌ EVENT NOT FOUND:", id);
        return (
            <div className="p-10">
                <h1 className="text-3xl font-bold text-red-500">Event not found</h1>
            </div>
        );
    }

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
            <EventForm type="edit" event={event} />
        </main>
    );
}
