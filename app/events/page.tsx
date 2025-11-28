export const dynamic = "force-dynamic";

import React from "react";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 }).lean();

    return (
        <main className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">All Events</h1>

            {events.length === 0 && (
                <p className="text-gray-400">No events available yet.</p>
            )}

            <div className="events">
                {events.map((event: any) => (
                    <EventCard
                        key={event._id.toString()}
                        _id={event._id.toString()}
                        title={event.title}
                        image={event.image}
                        location={event.location}
                        date={event.date}
                        time={event.time}
                    />
                ))}
            </div>
        </main>
    );
}
