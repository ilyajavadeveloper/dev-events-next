import { getEventById } from "@/lib/actions/event.actions";
import EventForm from "@/components/EventForm";

export default async function EditEventPage({
                                                params,
                                            }: {
    params: { id: string };
}) {
    const event = await getEventById(params.id);

    if (!event) {
        console.log("EVENT NOT FOUND:", params.id);
        return (
            <div className="p-10">
                <h1 className="text-3xl font-bold text-red-500">
                    Event not found
                </h1>
            </div>
        );
    }

    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

            {/* SafeEvent уже нормальный, ничего конвертировать не надо */}
            <EventForm type="edit" event={event} />
        </main>
    );
}
