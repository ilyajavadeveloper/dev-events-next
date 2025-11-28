"use server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";

// Нормализуем документ
function toPlain(doc: any) {
    return {
        _id: String(doc._id),
        title: doc.title || "",
        description: doc.description || "",
        overview: doc.overview || "",
        venue: doc.venue || "",
        location: doc.location || "",
        date: doc.date || "",
        time: doc.time || "",
        mode: doc.mode || "",
        audience: doc.audience || "",
        organizer: doc.organizer || "",
        image: doc.image || "",
        tags: Array.isArray(doc.tags) ? doc.tags : [],
        agenda: Array.isArray(doc.agenda) ? doc.agenda : [],
        createdAt: doc.createdAt?.toString() || "",
        updatedAt: doc.updatedAt?.toString() || "",
    };
}

export async function getEventById(id: string): Promise<any> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return null;

    const doc = (await Event.findById(id).lean()) as any;
    return doc ? toPlain(doc) : null;
}

export async function getSimilarEventsById(id: string): Promise<any[]> {
    await connectDB();
    if (!Types.ObjectId.isValid(id)) return [];

    const current = (await Event.findById(id).lean()) as any;
    if (!current) return [];

    const tags = Array.isArray(current.tags) ? current.tags : [];

    const docs = (await Event.find({
        _id: { $ne: current._id },
        tags: { $in: tags },
    }).lean()) as any[];

    return docs.map(toPlain);
}

export async function getAllEvents(): Promise<any[]> {
    await connectDB();

    const docs = (await Event.find().sort({ createdAt: -1 }).lean()) as any[];
    return docs.map(toPlain);
}

export async function updateEvent(id: string, data: any) {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return null;

    await Event.findByIdAndUpdate(
        id,
        {
            ...data,
            tags: Array.isArray(data.tags)
                ? data.tags
                : String(data.tags || "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),

            agenda: Array.isArray(data.agenda)
                ? data.agenda
                : String(data.agenda || "")
                    .split("\n")
                    .map((t) => t.trim())
                    .filter(Boolean),
        },
        { new: true }
    );

    const doc = (await Event.findById(id).lean()) as any;
    return doc ? toPlain(doc) : null;
}
