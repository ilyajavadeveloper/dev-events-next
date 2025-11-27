import React from "react";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { notFound } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import type { IEvent } from "@/database";

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
    await connectDB();

    const event = await Event.findOne({ slug: params.slug }).lean();

    if (!event) return notFound();

    return (
        <main>
            <EventDetails event={event as unknown as IEvent} />
        </main>
    );
}
