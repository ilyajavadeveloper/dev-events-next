"use client";

import { useState } from "react";
import { updateEvent } from "@/lib/actions/event.actions";
import { useRouter } from "next/navigation";

interface Props {
    type: "create" | "edit";
    event?: any;
}

export default function EventForm({ type, event }: Props) {
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

    const [imageFile, setImageFile] = useState<File | null>(null);

    const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageFile = (e: any) => {
        if (!e.target.files?.length) return;
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            agenda: form.agenda.split("\n").map((s) => s.trim()).filter(Boolean),
            tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        };

        if (type === "edit") {
            const res = await updateEvent(event._id.toString(), {
                ...payload,
                imageFile,
            });

            if (res.success) {
                alert("Event updated!");
                router.push(`/events/${event._id.toString()}`);
            } else {
                alert("Update failed");
            }
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
                className="input"
            />

            <textarea
                placeholder="Overview"
                value={form.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                className="input"
            />

            {/* 🟢 ВОТ ОНО — ТЕПЕРЬ ФАЙЛ */}
            <div className="flex flex-col gap-2">
                <p className="font-semibold">Event Image</p>

                {/* показать текущую фотку */}
                {event?.image && (
                    <img
                        src={event.image}
                        alt="current"
                        className="w-40 h-28 rounded object-cover"
                    />
                )}

                {/* выбор новой фотки */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                />

                <p className="text-sm text-gray-400">
                    {imageFile ? "New image selected" : "Keep current image"}
                </p>
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
                className="input"
            />

            <textarea
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                className="input"
            />

            <input
                placeholder="Organizer"
                value={form.organizer}
                onChange={(e) => updateField("organizer", e.target.value)}
                className="input"
            />

            <button onClick={handleSubmit} className="btn-primary">
                Save Changes
            </button>
        </div>
    );
}
