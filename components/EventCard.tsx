import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface EventCardProps {
    title: string;
    image: string;
    location: string;
    date: string;
    time: string;

    // поддерживаем оба варианта
    id?: string;
    _id?: string;
}

const EventCard = ({ title, image, time, location, date, id, _id }: EventCardProps) => {
    const eventId = id || _id?.toString();

    return (
        <Link
            href={`/events/${eventId}`}
            id="event-card"
            className="block rounded-xl overflow-hidden bg-[#121212] hover:bg-[#1A1A1A] transition-all shadow-lg hover:shadow-xl"
        >
            <Image
                src={image}
                alt={title}
                width={410}
                height={300}
                className="poster object-cover"
            />

            <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                    <p>{location}</p>
                </div>

                <p className="title text-xl font-semibold text-white">{title}</p>

                <div className="datetime flex items-center justify-between text-gray-300 text-sm mt-2">
                    <div className="flex items-center gap-1">
                        <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                        <p>{date}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
                        <p>{time}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
