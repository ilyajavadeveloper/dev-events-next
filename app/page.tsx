import React from "react";
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";

const Page = () => {
    return (
        <section className="w-full">
            <h1 className="text-center text-4xl font-bold leading-tight">
                The Hub for Every Dev <br /> Event You Can't Miss
            </h1>

            <p className="text-center mt-5 text-lg text-gray-300">
                Hackathons, Meetups & Conferences — All in One Place
            </p>

            <ExploreBtn />

            <div id="events" className="mt-20 space-y-7">
                <h3 className="text-2xl font-semibold">Featured Events</h3>

                <ul className="events">
                    {events.map((event) => (
                        <li key={event.slug}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Page;
