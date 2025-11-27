"use client";

import { useState } from "react";

export default function CreateEventForm() {
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [overview, setOverview] = useState("");
    const [venue, setVenue] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [mode, setMode] = useState("offline");
    const [audience, setAudience] = useState("");
    const [organizer, setOrganizer] = useState("");

    const [agenda, setAgenda] = useState<string[]>([""]);
    const [tags, setTags] = useState<string[]>([""]);

    const [image, setImage] = useState<File | null>(null);

    // ========= AGENDA HANDLERS =========

    const updateAgenda = (index: number, value: string) => {
        const copy = [...agenda];
        copy[index] = value;
        setAgenda(copy);
    };

    const addAgenda = () => setAgenda([...agenda, ""]);
    const removeAgenda = (i: number) =>
        setAgenda(agenda.filter((_, idx) => idx !== i));

    // ========= TAG HANDLERS =========

    const updateTag = (index: number, value: string) => {
        const copy = [...tags];
        copy[index] = value;
        setTags(copy);
    };

    const addTag = () => setTags([...tags, ""]);
    const removeTag = (i: number) => setTags(tags.filter((_, idx) => idx !== i));

    // ========= IMAGE UPLOAD =========

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setImage(e.target.files[0]);
    };

    // ========= SUBMIT =========

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            alert("Please upload an image.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("overview", overview);
            formData.append("venue", venue);
            formData.append("location", location);
            formData.append("date", date);
            formData.append("time", time);
            formData.append("mode", mode);
            formData.append("audience", audience);
            formData.append("organizer", organizer);

            formData.append("image", image);

            formData.append("agenda", JSON.stringify(agenda));
            formData.append("tags", JSON.stringify(tags));

            const res = await fetch("/api/events", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("Create event response:", data);

            if (!res.ok) {
                throw new Error(data.error || "Failed to create event");
            }

            alert("Event created!");
        } catch (error: any) {
            console.error("Create event error:", error);
            alert("Error creating event: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // ========= UI =========

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold">Create Event</h1>

            <input
                type="text"
                placeholder="Event title"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <textarea
                placeholder="Description"
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />

            <textarea
                placeholder="Overview"
                className="input"
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Venue"
                className="input"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Location"
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
            />

            <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />

            <input
                type="time"
                className="input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
            />

            <select value={mode} onChange={(e) => setMode(e.target.value)} className="input">
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
            </select>

            <input
                type="text"
                placeholder="Audience"
                className="input"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Organizer"
                className="input"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                required
            />

            {/* AGENDA */}
            <div className="flex flex-col gap-2">
                <p className="font-semibold">Agenda</p>
                {agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            className="input"
                            value={item}
                            onChange={(e) => updateAgenda(index, e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => removeAgenda(index)}>
                            ❌
                        </button>
                    </div>
                ))}
                <button type="button" className="btn-primary" onClick={addAgenda}>
                    Add agenda item
                </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-col gap-2">
                <p className="font-semibold">Tags</p>
                {tags.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            className="input"
                            value={item}
                            onChange={(e) => updateTag(index, e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => removeTag(index)}>
                            ❌
                        </button>
                    </div>
                ))}
                <button type="button" className="btn-primary" onClick={addTag}>
                    Add tag
                </button>
            </div>

            {/* IMAGE */}
            <input type="file" accept="image/*" onChange={handleImage} required />

            <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-4"
            >
                {loading ? "Creating..." : "Create Event"}
            </button>
        </form>
    );
}
