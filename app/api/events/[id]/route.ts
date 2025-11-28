import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// helper for Cloudinary upload
function uploadToCloudinary(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "DevEvent", resource_type: "image" },
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

export async function PATCH(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        const { id } = params;

        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        let finalImage = formData.get("currentImage");

        // upload new image if exists
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploaded = await uploadToCloudinary(buffer);
            finalImage = uploaded.secure_url;
        }

        // NORMALIZE DATA
        const tagsRaw = formData.get("tags") as string;
        const agendaRaw = formData.get("agenda") as string;

        const tags = tagsRaw
            ? tagsRaw.split(",").map((t) => t.trim())
            : [];

        const agenda = agendaRaw
            ? agendaRaw.split("\n").map((t) => t.trim())
            : [];

        const updateData = {
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
        };

        const updated = await Event.findByIdAndUpdate(id, updateData, {
            new: true,
        });

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
    } catch (err: any) {
        console.error("UPDATE EVENT ERROR:", err);
        return NextResponse.json(
            { message: "Update failed", error: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        const { id } = params;

        await Event.findByIdAndDelete(id);

        return NextResponse.json({ message: "Event deleted" }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { message: "Delete failed", error: err.message },
            { status: 500 }
        );
    }
}
