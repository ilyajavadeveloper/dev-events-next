import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const { slug } = params;
        const event = await Event.findOne({ slug });

        if (!event) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (e) {
        console.error("GET EVENT ERROR:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
