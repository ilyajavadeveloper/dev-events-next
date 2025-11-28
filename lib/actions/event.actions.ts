import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";

// ----------------------
// NORMALIZER
// ----------------------
function toPlain(doc: any): any {
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
        createdAt: doc.createdAt ? doc.createdAt.toString() : "",
        updatedAt: doc.updatedAt ? doc.updatedAt.toString() : "",
    };
}

// ----------------------
// GET EVENT BY ID — FIXED
// ----------------------
export async function getEventById(id: string): Promise<any> {
    await connectDB();

    let doc = null;

    // 1) если ID похож на ObjectId
    if (Types.ObjectId.isValid(id)) {
        doc = await Event.findById(id).lean();
    }

    // 2) если не нашли — ищем как строку
    if (!doc) {
        doc = await Event.findOne({ _id: id }).lean();
    }

    return doc ? toPlain(doc) : null;
}

// ----------------------
// GET ALL EVENTS
// ----------------------
export async function getAllEvents(): Promise<any[]> {
    await connectDB();

    const docs = await Event.find().sort({ createdAt: -1 }).lean();
    return docs.map(toPlain);
}

// ----------------------
// GET SIMILAR
// ----------------------
export async function getSimilarEventsById(id: string): Promise<any[]> {
    await connectDB();

    const current = await getEventById(id);
    if (!current) return [];

    const tags = Array.isArray(current.tags) ? current.tags : [];

    const docs = await Event.find({
        _id: { $ne: current._id },
        tags: { $in: tags },
    }).lean();

    return docs.map(toPlain);
}

// ----------------------
// UPDATE / DELETE / CREATE — можно оставить как есть
// ----------------------
