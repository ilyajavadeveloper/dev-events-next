import React from "react";
import Image from "next/image";
import EventCard from "@/components/EventCard";
import BookEvent from "@/components/BookEvent";
import { getSimilarEventsById } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";

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

const EventDetails = async ({ event }: { event: IEvent }) => {
    // === similar events by ID ===
    const similarEvents = await getSimilarEventsById(event._id.toString());

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

    // позже можно подключить реальное количество бронирований
    const bookings = 10;

    return (
        <section id="event">
            {/* ========= HEADER ========= */}
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            {/* ========= DETAILS ========= */}
            <div className="details">
                <div className="content">
                    <Image
                        src={image}
                        alt="Event Banner"
                        width={800}
                        height={800}
                        className="banner"
                    />

                    {/* Overview */}
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    {/* Event Details */}
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>

                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    {/* Agenda */}
                    <EventAgenda items={agenda} />

                    {/* Organizer */}
                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    {/* Tags */}
                    <EventTags tags={event.tags} />
                </div>

                {/* ========= BOOKING ========= */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>

                        <p className="text-sm">
                            {bookings > 0
                                ? `Join ${bookings} people who already booked their spot!`
                                : "Be the first to book your spot!"}
                        </p>

                        <BookEvent eventId={event._id.toString()} />
                    </div>
                </aside>
            </div>

            {/* ========= SIMILAR ========= */}
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>

                <div className="events">
                    {similarEvents.map((item) => (
                        <EventCard key={item._id.toString()} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventDetails;
