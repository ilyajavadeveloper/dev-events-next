import { getEventById } from "@/lib/actions/event.actions";
import EventForm from "@/components/EventForm";

// ⛔ ОБРАТИ ВНИМАНИЕ: params — Promise
export default async function EditEventPage({
                                                params,
                                            }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params; // ✅ тут мы его await-им

    const event = await getEventById(id);

    if (!event) {
        console.log("❌ EVENT NOT FOUND (edit):", id);
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
            <EventForm type="edit" event={event} />
        </main>
    );
}
