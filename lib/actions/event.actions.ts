"use server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";

// ----------------------
// TYPE
// ----------------------
export type SafeEvent = {
    _id: string;
    title: string;
    description: string;
    overview: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    organizer: string;
    image: string;
    tags: string[];
    agenda: string[];
    createdAt: string;
    updatedAt: string;
};

// ----------------------
// NORMALIZER
// ----------------------
function toPlain(doc: any): SafeEvent {
    return {
        _id: doc._id.toString(),
        title: doc.title ?? "",
        description: doc.description ?? "",
        overview: doc.overview ?? "",
        venue: doc.venue ?? "",
        location: doc.location ?? "",
        date: doc.date ?? "",
        time: doc.time ?? "",
        mode: doc.mode ?? "",
        audience: doc.audience ?? "",
        organizer: doc.organizer ?? "",
        image: doc.image ?? "",
        tags: Array.isArray(doc.tags) ? doc.tags : [],
        agenda: Array.isArray(doc.agenda) ? doc.agenda : [],
        createdAt: doc.createdAt?.toString() ?? "",
        updatedAt: doc.updatedAt?.toString() ?? "",
    };
}

// ----------------------
// GET ONE EVENT
// ----------------------
export async function getEventById(id: string): Promise<SafeEvent | null> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await Event.findById(id).lean<any>(); // ❤️ FIX

    if (!doc) return null;

    return toPlain(doc);
}

// ----------------------
// GET SIMILAR
// ----------------------
export async function getSimilarEventsById(id: string): Promise<SafeEvent[]> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return [];

    const current = await Event.findById(id).lean<any>(); // ❤️ FIX
    if (!current) return [];

    const tags = Array.isArray(current.tags) ? current.tags : [];

    const docs = await Event.find({
        _id: { $ne: current._id },
        tags: { $in: tags },
    }).lean<any[]>(); // ❤️ FIX

    return docs.map(toPlain);
}

// ----------------------
// GET ALL EVENTS
// ----------------------
export async function getAllEvents(): Promise<SafeEvent[]> {
    await connectDB();

    const docs = await Event.find().sort({ createdAt: -1 }).lean<any[]>(); // ❤️ FIX

    return docs.map(toPlain);
}
