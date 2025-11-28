import React from "react";
import Image from "next/image";
import EventCard from "@/components/EventCard";
import BookEvent from "@/components/BookEvent";
import { SafeEvent } from "@/lib/actions/event.actions"; // ❤️ ВАЖНО

const EventDetailItem = ({
                             icon,
                             alt,
                             label,
                         }: {
    icon: string;
    alt: string;
    label: string;
}) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
);

const EventAgenda = ({ items }: { items: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div key={tag} className="pill">
                {tag}
            </div>
        ))}
    </div>
);

export default function EventDetails({
                                         event,
                                         similarEvents = [],
                                     }: {
    event: SafeEvent;              // ❤️ ПРАВИЛЬНО
    similarEvents?: SafeEvent[];   // ❤️ ПРАВИЛЬНО
}) {
    const safeSimilar = Array.isArray(similarEvents) ? similarEvents : [];

    const {
        image,
        description,
        overview,
        date,
        time,
        location,
        mode,
        audience,
        agenda,
        organizer,
    } = event;

    const bookings = 10;

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image
                        src={image}
                        alt="Event Banner"
                        width={800}
                        height={800}
                        className="banner"
                    />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda items={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={event.tags} />
                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        <p className="text-sm">
                            {bookings > 0
                                ? `Join ${bookings} people who already booked their spot!`
                                : "Be the first to book your spot!"}
                        </p>

                        <BookEvent eventId={event._id} />
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>

                <div className="events">
                    {safeSimilar.length === 0 && (
                        <p className="text-gray-400">No similar events found.</p>
                    )}

                    {safeSimilar.map((item) => (
                        <EventCard
                            key={item._id}
                            _id={item._id}
                            title={item.title}
                            image={item.image}
                            location={item.location}
                            date={item.date}
                            time={item.time}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
