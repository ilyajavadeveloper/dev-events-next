"use server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

// ============================================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ЧИСТКИ MONGOOSE-DOC
// ============================================================

function toPlain(event: any) {
    if (!event) return null;

    return {
        ...event,
        _id: event._id.toString(),
        createdAt: event.createdAt ? event.createdAt.toString() : "",
        updatedAt: event.updatedAt ? event.updatedAt.toString() : "",
    };
}

// ============================================================
// GET EVENT BY ID (для /events/[id]/edit и /events/[id])
// ============================================================

export async function getEventById(id: string) {
    try {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) return null;

        const event = await Event.findById(id).lean();

        return toPlain(event);
    } catch (e) {
        console.error("getEventById error:", e);
        return null;
    }
}

// ============================================================
// GET SIMILAR EVENTS BY ID
// ============================================================

export async function getSimilarEventsById(id: string) {
    try {
        await connectDB();

        if (!Types.ObjectId.isValid(id)) return [];

        const current = await Event.findById(id).lean();

        if (!current) return [];

        const tagList = Array.isArray(current.tags) ? current.tags : [];


        const similar = await Event.find({
            _id: { $ne: new Types.ObjectId(current._id) },
            tags: { $in: tagList },
        }).lean();

        return similar.map(toPlain);
    } catch (e) {
        console.error("similar events error:", e);
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

        return events.map(toPlain);
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
        console.error("delete event error:", err);
        return { success: false };
    }
}

// ============================================================
// UPDATE EVENT
// ============================================================

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
        console.error("update event error:", err);
        return { success: false };
    }
}
