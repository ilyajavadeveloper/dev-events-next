"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";

interface BookEventProps {
    eventId: string;
}

const BookEvent = ({ eventId }: BookEventProps) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleBooking = async () => {
        if (!email.trim()) return;

        setLoading(true);

        const res = await createBooking({
            eventId,
            email,
        });

        setLoading(false);

        if (res.success) {
            alert("You successfully booked this event!");
        } else {
            alert("Booking failed.");
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <input
                type="email"
                placeholder="Enter your email"
                className="input bg-dark-200 rounded-[6px] px-5 py-2.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                onClick={handleBooking}
                className="btn-primary bg-primary hover:bg-primary/90 w-full rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black cursor-pointer"
                disabled={loading}
            >
                {loading ? "Booking..." : "Book Now"}
            </button>
        </div>
    );
};

export default BookEvent;
