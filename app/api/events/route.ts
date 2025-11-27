import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const file = formData.get("image") as File | null;
        if (!file) {
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );
        }

        // Convert file → buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: "image", folder: "DevEvent" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        // PARSE STRINGS
        const tags = JSON.parse(formData.get("tags") as string);
        const agenda = JSON.parse(formData.get("agenda") as string);

        // CREATE OBJECT
        const eventData = {
            title: formData.get("title"),
            description: formData.get("description"),
            overview: formData.get("overview"),
            venue: formData.get("venue"),
            location: formData.get("location"),
            date: formData.get("date"),
            time: formData.get("time"),
            mode: formData.get("mode"),
            audience: formData.get("audience"),
            organizer: formData.get("organizer"),
            image: uploadResult.secure_url,
            agenda,
            tags,
        };

        const createdEvent = await Event.create(eventData);

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    } catch (e: any) {
        console.error("CREATE EVENT ERROR:", e);
        return NextResponse.json(
            {
                message: "Failed to create event",
                error: e.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}
