"use server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import type { IEvent } from "@/database";

// ============================================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: ПРИВЕСТИ ДОКУМЕНТ К ЧИСТОМУ ВИДУ
// ============================================================
type SafeEvent = Omit<IEvent, "_id" | "createdAt" | "updatedAt"> & {
    _id: string;
    createdAt: string;
    updatedAt: string;
};

function toPlain(event: any) {
    if (!event) return null;

    return {
        ...event,
        _id: event._id.toString(),
        createdAt: event.createdAt?.toString() || "",
        updatedAt: event.updatedAt?.toString() || "",
    };
}

// ============================================================
// GET EVENT BY ID
// ============================================================

export async function getEventById(id: string): Promise<IEvent | null> {
    try {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) return null;

        const event = await Event.findById(id).lean<IEvent>();
        return toPlain(event);
    } catch (e) {
        console.error("getEventById error:", e);
        return null;
    }
}

// ============================================================
// GET SIMILAR EVENTS
// ============================================================

export async function getSimilarEventsById(id: string): Promise<IEvent[]> {
    try {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) return [];

        const current = await Event.findById(id).lean<IEvent>();
        if (!current) return [];

        const tagList = Array.isArray(current.tags) ? current.tags : [];

        const similar = await Event.find({
            _id: { $ne: new Types.ObjectId(current._id as any) },
            tags: { $in: tagList },
        }).lean<IEvent[]>();

        return similar.map(toPlain) as IEvent[];
    } catch (e) {
        console.error("similar events error:", e);
        return [];
    }
}

// ============================================================
// GET ALL EVENTS (для /events/manage)
// ============================================================

export async function getAllEvents(): Promise<IEvent[]> {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 }).lean<IEvent[]>();

        return events.map(toPlain) as IEvent[];
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

        if (!Types.ObjectId.isValid(id)) return { success: false };

        await Event.findByIdAndDelete(id);

        revalidatePath("/events/manage");

        return { success: true };
    } catch (err) {
        console.error("delete event error", err);
        return { success: false };
    }
}

// ============================================================
// UPDATE EVENT
// ============================================================

export async function updateEvent(id: string, data: any) {
    try {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) return { success: false };

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
