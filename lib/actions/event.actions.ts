"use server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import type { IEvent } from "@/database";

// ============================================================
// GET EVENT BY ID (нужно для страницы редактирования)
// ============================================================

export async function getEventById(id: string): Promise<IEvent | null> {
    try {
        await connectDB();

        const event = await Event.findById(id).lean<IEvent>();

        return event || null;
    } catch (e) {
        console.error("getEventById error:", e);
        return null;
    }
}

// ============================================================
// GET SIMILAR EVENTS BY ID (вместо slug)
// ============================================================

export async function getSimilarEventsById(id: string): Promise<IEvent[]> {
    try {
        await connectDB();

        const current = await Event.findById(id).lean<IEvent>();

        if (!current) return [];

        const similar = await Event.find({
            _id: { $ne: current._id },
            tags: { $in: current.tags },
        }).lean<IEvent[]>();

        return similar;
    } catch (e) {
        console.error("similar events error", e);
        return [];
    }
}

// ============================================================
// GET ALL EVENTS (для /events/manage)
// ============================================================

export async function getAllEvents() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return events;
    } catch (e) {
        console.error("Error fetching events", e);
        return [];
    }
}

// ============================================================
// DELETE EVENT
// ============================================================

export async function deleteEvent(id: string) {
    try {
        await connectDB();

        await Event.findByIdAndDelete(id);

        revalidatePath("/events/manage");

        return { success: true };
    } catch (err) {
        console.error("delete event error", err);
        return { success: false };
    }
}

export async function updateEvent(id: string, data: any) {
    try {
        await connectDB();

        await Event.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        revalidatePath(`/events/${id}`);
        revalidatePath("/events/manage");

        return { success: true };
    } catch (err) {
        console.error("update event error", err);
        return { success: false };
    }
}
