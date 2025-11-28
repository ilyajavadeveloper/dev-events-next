import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "DevEvent" },
            (error, result) => (error ? reject(error) : resolve(result))
        ).end(buffer);
    });
}

export async function PATCH(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        const { id } = params;

        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        // If no new image → keep old
        let finalImage = formData.get("currentImage");

        // Upload new image
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploaded = await uploadToCloudinary(buffer);
            finalImage = uploaded.secure_url;
        }

        // Parse text inputs
        const tags = (formData.get("tags") as string)
            ?.split(",")
            .map((t) => t.trim()) ?? [];

        const agenda = (formData.get("agenda") as string)
            ?.split("\n")
            .map((l) => l.trim()) ?? [];

        const updated = await Event.findByIdAndUpdate(
            id,
            {
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
                image: finalImage,
                tags,
                agenda,
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event updated", event: updated },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("UPDATE EVENT ERROR:", error);
        return NextResponse.json(
            { message: "Update failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        const { id } = params;

        await Event.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Event deleted" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Delete failed", error: error.message },
            { status: 500 }
        );
    }
}
