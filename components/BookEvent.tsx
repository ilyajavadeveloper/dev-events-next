"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";

interface BookEventProps {
    eventId: string;
    slug: string;
}

const BookEvent = ({ eventId, slug }: BookEventProps) => {
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
            alert(`You booked event "${slug}" successfully!`);
        } else {
            alert("Booking failed.");
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <input
                type="email"
                placeholder="Enter your email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                onClick={handleBooking}
                className="btn-primary"
                disabled={loading}
            >
                {loading ? "Booking..." : "Book Now"}
            </button>
        </div>
    );
};

export default BookEvent;
