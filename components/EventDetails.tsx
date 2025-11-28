import React from "react";
import Image from "next/image";
import EventCard from "@/components/EventCard";
import BookEvent from "@/components/BookEvent";

export default function EventDetails({
                                         event,
                                         similarEvents = [],
                                     }: {
    event: any;
    similarEvents: any[];
}) {
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
        tags,
    } = event;

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

                    <section>
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section>
                        <h2>Event Details</h2>
                        <p>{date}</p>
                        <p>{time}</p>
                        <p>{location}</p>
                        <p>{mode}</p>
                        <p>{audience}</p>
                    </section>

                    <section>
                        <h2>Agenda</h2>
                        <ul>
                            {agenda.map((i: string, idx: number) => (
                                <li key={idx}>{i}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2>Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <section>
                        <h2>Tags</h2>
                        <div className="flex flex-row gap-2 flex-wrap">
                            {tags.map((tag: string, idx: number) => (
                                <span key={idx} className="pill">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="booking">
                    <BookEvent eventId={event._id} />
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.map((item: any) => (
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
