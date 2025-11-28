import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import ManageEvents from "@/components/ManageEvents";

export default async function ManageEventsPage() {
    await connectDB();

    // Забираем из базы
    const rawEvents = await Event.find().sort({ createdAt: -1 }).lean();

    // Нормализуем под EventItem[]
    const events = rawEvents.map((ev: any) => ({
        _id: String(ev._id),
        title: ev.title ?? "",
        image: ev.image ?? "",
        date: ev.date ?? "",
        time: ev.time ?? "",
    }));

    return (
        <main className="max-w-5xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
            <ManageEvents events={events} />
        </main>
    );
}
