import React from "react";
import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
    return (
        <main className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-4 text-gradient">
                Create a New Dev Event
            </h1>
            <p className="text-light-200 mb-8">
                Fill in the details below to publish your event to DevEvent.
            </p>

            <CreateEventForm />
        </main>
    );
}
