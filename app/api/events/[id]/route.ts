import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// ================ UPDATE EVENT (PATCH) ================
export async function PATCH(req: NextRequest, { params }: any) {
    try {
        await connectDB();

        const formData = await req.formData();
        const { id } = params;

        const file = formData.get("image") as File | null;

        let finalImage = null;

        // если не загрузили новое фото → оставляем старое
        if (!file) {
            finalImage = formData.get("currentImage");
        } else {
            const buffer = Buffer.from(await file.arrayBuffer());

            const uploaded: any = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "DevEvent", resource_type: "image" },
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    )
                    .end(buffer);
            });

            finalImage = uploaded.secure_url;
        }

        const tags = JSON.parse(formData.get("tags") as string);
        const agenda = JSON.parse(formData.get("agenda") as string);

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
    } catch (e: any) {
        console.error("UPDATE EVENT ERROR:", e);
        return NextResponse.json(
            { message: "Update failed", error: e.message },
            { status: 500 }
        );
    }
}

// ================ DELETE EVENT ================
export async function DELETE(req: NextRequest, { params }: any) {
    try {
        await connectDB();
        const { id } = params;

        await Event.findByIdAndDelete(id);

        return NextResponse.json({ message: "Event deleted" }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { message: "Delete failed", error: e.message },
            { status: 500 }
        );
    }
}
