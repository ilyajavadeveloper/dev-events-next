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

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Required image
        const file = formData.get("image") as File;
        if (!file)
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );

        // Tags & agenda from JSON strings
        const tags = formData.get("tags")
            ? JSON.parse(formData.get("tags") as string)
            : [];

        const agenda = formData.get("agenda")
            ? JSON.parse(formData.get("agenda") as string)
            : [];

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await uploadToCloudinary(buffer);

        const newEvent = await Event.create({
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
            image: uploaded.secure_url,
            tags,
            agenda,
        });

        return NextResponse.json(
            { message: "Event created", event: newEvent },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("CREATE EVENT ERROR:", error);
        return NextResponse.json(
            { message: "Creation failed", error: error.message },
            { status: 500 }
        );
    }
}
