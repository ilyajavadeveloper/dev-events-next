import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import ManageEvents from "@/components/ManageEvents";

export default async function ManageEventsPage() {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return (
        <main className="max-w-5xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
            <ManageEvents events={events} />
        </main>
    );
}
