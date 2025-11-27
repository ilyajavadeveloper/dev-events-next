import { getAllEvents } from "@/lib/actions/event.actions";
import ManageEvents from "@/components/ManageEvents";

export default async function ManageEventsPage() {
    const events = await getAllEvents();

    const safeEvents = events.map((e: any) => ({
        ...e,
        _id: String(e._id),
    }));

    return (
        <section className="max-w-5xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
            <ManageEvents events={safeEvents} />
        </section>
    );
}
