"use client";

import { useState } from "react";
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
    const [loading, setLoading] = useState(false);

    const updateField = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("overview", form.overview);
        formData.append("venue", form.venue);
        formData.append("location", form.location);
        formData.append("date", form.date);
        formData.append("time", form.time);
        formData.append("mode", form.mode);
        formData.append("audience", form.audience);
        formData.append("organizer", form.organizer);

        formData.append(
            "agenda",
            JSON.stringify(form.agenda.split("\n").map((s: string) => s.trim()).filter(Boolean))
        );

        formData.append(
            "tags",
            JSON.stringify(form.tags.split(",").map((s: string) => s.trim()).filter(Boolean))
        );

        formData.append("currentImage", event?.image || "");

        if (imageFile) formData.append("image", imageFile);

        const res = await fetch(`/api/events/${event._id}`, {
            method: "PATCH",
            body: formData,
        });

        if (!res.ok) {
            alert("Failed to update event");
        } else {
            alert("Event updated successfully");
            router.push(`/events/${event._id}`);
        }

        setLoading(false);
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

            <div className="flex flex-col gap-2">
                <p className="font-semibold">Event Image</p>

                {event?.image && (
                    <img
                        src={event.image}
                        alt="Current"
                        className="w-40 h-28 object-cover rounded-md"
                    />
                )}

                <input type="file" accept="image/*" onChange={handleImage} />
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
                placeholder="Agenda (each line = one item)"
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
                disabled={loading}
            >
                {loading ? "Saving..." : type === "edit" ? "Save Changes" : "Create Event"}
            </button>
        </div>
    );
}
