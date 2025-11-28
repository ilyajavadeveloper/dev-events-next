import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import Link from "next/link";

export default async function ManageEventsPage() {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return (
        <section className="max-w-5xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-700 rounded-lg">
                    <thead className="bg-gray-900">
                    <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Mode</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {events.map((event: any) => (
                        <tr key={event._id} className="border-t border-gray-800">
                            <td className="px-4 py-3">{event.title}</td>

                            <td className="px-4 py-3">
                                {event.date
                                    ? new Date(event.date).toLocaleDateString()
                                    : "—"}
                            </td>

                            <td className="px-4 py-3 capitalize">{event.mode}</td>

                            <td className="px-4 py-3 text-right space-x-3">
                                <Link
                                    href={`/events/${event._id.toString()}/edit`}
                                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                                >
                                    Edit
                                </Link>

                                <form
                                    action={`/api/events/${event._id.toString()}`}
                                    method="POST"
                                    className="inline"
                                >
                                    <button
                                        formMethod="DELETE"
                                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
