import React from "react";
import EventCard from "@/components/EventCard";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

const Page = async () => {
    await connectDB();

    const events = await Event.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

    return (
        <section className="w-full">
            <h1 className="text-center text-4xl font-bold leading-tight">
                The Hub for Every Dev <br /> Event You Can't Miss
            </h1>

            <p className="text-center mt-5 text-lg text-gray-300">
                Hackathons, Meetups & Conferences — All in One Place
            </p>

            <a
                href="#events"
                className="mt-7 mx-auto flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition"
            >
                Explore Events
                <img src="/icons/arrow-down.svg" width={24} height={24} alt="arrow" />
            </a>

            <div id="events" className="mt-20 space-y-7">
                <h3 className="text-2xl font-semibold">Featured Events</h3>

                {events.length === 0 ? (
                    <p className="text-gray-400">No events yet. Create one!</p>
                ) : (
                    <ul className="events">
                        {events.map((event: any) => (
                            <li key={event._id.toString()}>
                                <EventCard
                                    _id={event._id.toString()}
                                    title={event.title}
                                    image={event.image}
                                    time={event.time}
                                    location={event.location}
                                    date={event.date}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default Page;
