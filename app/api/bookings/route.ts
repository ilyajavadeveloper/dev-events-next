import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";

// ========================
// CREATE BOOKING (POST)
// ========================
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const { eventId, email } = body;

        if (!eventId || !email) {
            return NextResponse.json(
                { success: false, error: "eventId and email are required" },
                { status: 400 }
            );
        }

        const booking = await Booking.create({ eventId, email });

        return NextResponse.json(
            { success: true, booking },
            { status: 201 }
        );
    } catch (e: any) {
        console.error("BOOKING ERROR:", e);
        return NextResponse.json(
            { success: false, error: e.message || "Unknown error" },
            { status: 500 }
        );
    }
}

// ========================
// GET ALL BOOKINGS (GET)
// ========================
export async function GET() {
    try {
        await connectDB();

        const bookings = await Booking.find().sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, bookings },
            { status: 200 }
        );
    } catch (e: any) {
        console.error("BOOKINGS FETCH ERROR:", e);
        return NextResponse.json(
            { success: false, error: e.message },
            { status: 500 }
        );
    }
}
