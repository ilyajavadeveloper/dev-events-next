import React from "react";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import type { IEvent } from "@/database";

export default async function EventDetailsPage({
                                                   params,
                                               }: {
    params: { id: string };
}) {
    await connectDB();

    // Ищем по ID, а не по slug
    const event = await Event.findById(params.id).lean();

    if (!event) return notFound();

    return (
        <main>
            <EventDetails event={event as unknown as IEvent} />
        </main>
    );
}
