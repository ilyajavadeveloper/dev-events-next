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
        image: event?.image || "", // ← тут либо URL, либо File
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

    const [loading, setLoading] = useState(false);

    const updateField = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // ==================
    // SUBMIT HANDLER
    // ==================
    const handleSubmit = async () => {
        setLoading(true);

        const fd = new FormData();

        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("overview", form.overview);

        // image logic
        if (form.image instanceof File) {
            fd.append("image", form.image);
        } else {
            fd.append("currentImage", form.image);
        }

        fd.append("venue", form.venue);
        fd.append("location", form.location);
        fd.append("date", form.date);
        fd.append("time", form.time);
        fd.append("mode", form.mode);
        fd.append("audience", form.audience);
        fd.append("organizer", form.organizer);

        fd.append(
            "agenda",
            JSON.stringify(
                form.agenda.split("\n").map((a: string) => a.trim()).filter(Boolean)
            )
        );

        fd.append(
            "tags",
            JSON.stringify(
                form.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
            )
        );

        let res;

        if (type === "edit") {
            res = await updateEvent(event._id.toString(), fd);
        } else {
            // createEvent если понадобится
        }

        if (!res?.success) {
            alert("❌ Failed to save event");
        } else {
            alert("✅ Event saved!");
            router.push(`/events/${event?._id || ""}`);
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6">

            {/* EVENT TITLE */}
            <input
                className="input"
                placeholder="Title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
            />

            <textarea
                className="input h-24"
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
            />

            <textarea
                className="input h-20"
                placeholder="Overview"
                value={form.overview}
                onChange={(e) => updateField("overview", e.target.value)}
            />

            {/* IMAGE SECTION */}
            {type === "edit" && form.image && typeof form.image === "string" && (
                <img
                    src={form.image}
                    alt="Current event image"
                    className="w-40 h-40 object-cover rounded-xl border mb-2"
                />
            )}

            <input
                type="file"
                accept="image/*"
                onChange={(e) => updateField("image", e.target.files?.[0] || null)}
                className="input"
            />

            <input
                className="input"
                placeholder="Venue"
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
            />

            <input
                className="input"
                placeholder="Location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
            />

            <input
                type="date"
                className="input"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
            />

            <input
                type="time"
                className="input"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
            />

            <select
                className="input"
                value={form.mode}
                onChange={(e) => updateField("mode", e.target.value)}
            >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
            </select>

            <input
                className="input"
                placeholder="Audience"
                value={form.audience}
                onChange={(e) => updateField("audience", e.target.value)}
            />

            <textarea
                className="input h-28"
                placeholder="Agenda (each item on new line)"
                value={form.agenda}
                onChange={(e) => updateField("agenda", e.target.value)}
            />

            <textarea
                className="input h-20"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
            />

            <input
                className="input"
                placeholder="Organizer"
                value={form.organizer}
                onChange={(e) => updateField("organizer", e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? "Saving..." : type === "edit" ? "Save Changes" : "Create Event"}
            </button>
        </div>
    );
}
