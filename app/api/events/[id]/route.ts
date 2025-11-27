import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const rawEvent = Object.fromEntries(formData.entries());

        // Parse JSON arrays
        let tags = [];
        let agenda = [];

        try {
            tags = JSON.parse(formData.get("tags") as string);
            agenda = JSON.parse(formData.get("agenda") as string);
        } catch {
            return NextResponse.json(
                { message: "Invalid JSON format for tags/agenda" },
                { status: 400 }
            );
        }

        const file = formData.get("image") as File;
        if (!file) {
            return NextResponse.json(
                { message: "Image is required" },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploaded = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "DevEvent", resource_type: "image" },
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result);
                }
            ).end(buffer);
        });

        const imageUrl = (uploaded as any).secure_url;

        // Create event in DB
        const createdEvent = await Event.create({
            title: rawEvent.title,
            description: rawEvent.description,
            overview: rawEvent.overview,
            venue: rawEvent.venue,        // ✔ FIXED
            location: rawEvent.location,
            date: rawEvent.date,
            time: rawEvent.time,
            mode: rawEvent.mode,
            audience: rawEvent.audience,
            organizer: rawEvent.organizer,
            image: imageUrl,
            tags,
            agenda,
        });

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    } catch (e: any) {
        console.error("EVENT CREATE ERROR:", e);
        return NextResponse.json(
            {
                message: "Event creation failed",
                error: e.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json(
            { message: "Events fetched successfully", events },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: "Event fetching failed", error: e },
            { status: 500 }
        );
    }
}
