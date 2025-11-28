"use client";

import React, { useState } from "react";
import { updateEvent } from "@/lib/actions/event.actions";
import { useRouter } from "next/navigation";

interface Props {
    type: "create" | "edit";
    event?: any;
}

const EventForm = ({ type, event }: Props) => {
    const router = useRouter();

    const [form, setForm] = useState({
        title: event?.title || "",
        description: event?.description || "",
        overview: event?.overview || "",
        venue: event?.venue || "",
        location: event?.location || "",
        date: event?.date || "",
        time: event?.time || "",
        mode: event?.mode || "offline",
        audience: event?.audience || "",
        agenda: event?.agenda?.join("\n") || "",
        organizer: event?.organizer || "",
        tags: event?.tags?.join(", ") || "",
    });

    const [newImage, setNewImage] = useState<File | null>(null);

    const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setNewImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            agenda: form.agenda.split("\n").map((s: string) => s.trim()).filter(Boolean),
            tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
        };

        const result = await updateEvent(event._id.toString(), {
            ...payload,
            newImage, // ⬅ отправляем на сервер
        });

        if (result.success) {
            router.push(`/events/${event._id.toString()}`);
            router.refresh();
        } else {
            alert("Failed to update event");
        }
    };

    return (
        <div className="flex flex-col gap-6">

            <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="input"
            />

            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="input h-24"
            />

            <textarea
                placeholder="Overview"
                value={form.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                className="input h-20"
            />

            {/* IMAGE FIELD (NEW) */}
            <div className="flex flex-col gap-2">
                <p className="font-semibold">Event Image</p>

                {/* CURRENT IMAGE */}
                {event?.image && (
                    <img
                        src={event.image}
                        alt="Current"
                        className="w-40 h-28 rounded object-cover border border-gray-700"
                    />
                )}

                {/* NEW UPLOAD */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="input"
                />

                {newImage && (
                    <p className="text-green-400 text-sm">New image selected ✔</p>
                )}
            </div>

            <input
                placeholder="Venue"
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                className="input"
            />

            <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="input"
            />

            <input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className="input"
            />

            <input
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                className="input"
            />

            <select
                value={form.mode}
                onChange={(e) => updateField("mode", e.target.value)}
                className="input"
            >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
            </select>

            <input
                placeholder="Audience"
                value={form.audience}
                onChange={(e) => updateField("audience", e.target.value)}
                className="input"
            />

            <textarea
                placeholder="Agenda (each item on new line)"
                value={form.agenda}
                onChange={(e) => updateField("agenda", e.target.value)}
                className="input h-28"
            />

            <textarea
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                className="input h-20"
            />

            <input
                placeholder="Organizer"
                value={form.organizer}
                onChange={(e) => updateField("organizer", e.target.value)}
                className="input"
            />

            <button
                onClick={handleSubmit}
                className="btn-primary"
            >
                Save Changes
            </button>
        </div>
    );
};

export default EventForm;
