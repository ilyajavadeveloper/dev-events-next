import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// =============================
// UPDATE EVENT (PATCH)
// =============================
export async function PATCH(req: NextRequest, { params }: any) {
    try {
        await connectDB();

        const { id } = params;
        const body = await req.json();

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        if (!updatedEvent) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event updated", event: updatedEvent },
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

// =============================
// DELETE EVENT (DELETE)
// =============================
export async function DELETE(req: NextRequest, { params }: any) {
    try {
        await connectDB();

        const { id } = params;

        await Event.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Event deleted" },
            { status: 200 }
        );

    } catch (e: any) {
        return NextResponse.json(
            { message: "Delete failed", error: e.message },
            { status: 500 }
        );
    }
}
