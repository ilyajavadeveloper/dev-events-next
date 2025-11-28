import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";

// --------------------------------------------------
// TYPES (TS пофиг — просто декларация)
// --------------------------------------------------
export type SafeEvent = any;

// --------------------------------------------------
// NORMALIZER (оставляем — полезно)
// --------------------------------------------------
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

// --------------------------------------------------
// GET ONE EVENT
// --------------------------------------------------
export async function getEventById(id: string): Promise<any> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return null;

    const doc: any = await Event.findById(id).lean();
    return doc ? toPlain(doc) : null;
}

// --------------------------------------------------
// GET ALL EVENTS
// --------------------------------------------------
export async function getAllEvents(): Promise<any[]> {
    await connectDB();

    const docs: any[] = await Event.find().sort({ createdAt: -1 }).lean();
    return docs.map(toPlain);
}

// --------------------------------------------------
// GET SIMILAR EVENTS
// --------------------------------------------------
export async function getSimilarEventsById(id: string): Promise<any[]> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return [];

    const current: any = await Event.findById(id).lean();
    if (!current) return [];

    const tags = Array.isArray(current.tags) ? current.tags : [];

    const docs: any[] = await Event.find({
        _id: { $ne: current._id },
        tags: { $in: tags },
    }).lean();

    return docs.map(toPlain);
}

// --------------------------------------------------
// CREATE EVENT
// --------------------------------------------------
export async function createEvent(data: any): Promise<any> {
    await connectDB();

    const event = await Event.create({
        ...data,
        tags: Array.isArray(data.tags)
            ? data.tags
            : (data.tags || "")
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean),

        agenda: Array.isArray(data.agenda)
            ? data.agenda
            : (data.agenda || "")
                .split("\n")
                .map((t: string) => t.trim())
                .filter(Boolean),
    });

    const doc: any = await Event.findById(event._id).lean();
    return doc ? toPlain(doc) : null;
}

// --------------------------------------------------
// UPDATE EVENT
// --------------------------------------------------
export async function updateEvent(id: string, data: any): Promise<any> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return null;

    await Event.findByIdAndUpdate(
        id,
        {
            ...data,
            tags: Array.isArray(data.tags)
                ? data.tags
                : (data.tags || "")
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter(Boolean),

            agenda: Array.isArray(data.agenda)
                ? data.agenda
                : (data.agenda || "")
                    .split("\n")
                    .map((t: string) => t.trim())
                    .filter(Boolean),
        },
        { new: true }
    );

    const doc: any = await Event.findById(id).lean();
    return doc ? toPlain(doc) : null;
}

// --------------------------------------------------
// DELETE EVENT
// --------------------------------------------------
export async function deleteEvent(id: string): Promise<any> {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) return { success: false };

    const deleted: any = await Event.findByIdAndDelete(id);
    return { success: !!deleted };
}
