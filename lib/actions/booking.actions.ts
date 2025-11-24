'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";

export const createBooking = async ({
                                        eventId,
                                        email
                                    }: {
    eventId: string;
    email: string;
}) => {
    try {
        await connectDB();

        // 🔥 ФИКС №2 — убран slug
        await Booking.create({ eventId, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
};
