'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import type { IEvent } from "@/database";

export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean<IEvent>();

        if (!event) return [];

        const similar = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean<IEvent[]>();

        return similar;
    } catch (e) {
        console.error("similar events error", e);
        return [];
    }
};
