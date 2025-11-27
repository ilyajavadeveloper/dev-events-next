import { getEventById } from "@/lib/actions/event.actions";
import EventForm from "@/components/EventForm";

export default async function EditEventPage({ params }: any) {
    const { id } = params;

    const event = await getEventById(id);

    if (!event) {
        return (
            <div className="p-10 text-red-400 text-xl">
                Event not found.
            </div>
        );
    }

    return (
        <section className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
            <EventForm  type="edit" event={event} />
        </section>
    );
}
