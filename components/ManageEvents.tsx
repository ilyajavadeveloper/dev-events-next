"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { deleteEvent } from "@/lib/actions/event.actions";
import { useRouter } from "next/navigation";

interface Props {
    events: any[];
}

const ManageEvents = ({ events }: Props) => {
    const [openId, setOpenId] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        if (!openId) return;

        const res = await deleteEvent(openId);

        if (res.success) {
            setOpenId(null);
            router.refresh();
        }
    };

    if (!events.length) {
        return <p className="text-gray-400">No events found.</p>;
    }

    return (
        <>
            <div className="space-y-5">
                {events.map((e) => (
                    <div
                        key={e._id}
                        className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl"
                    >
                        <div className="flex items-center gap-4">
                            <Image
                                src={e.image}
                                alt={e.title}
                                width={100}
                                height={70}
                                className="rounded-md object-cover"
                            />

                            <div>
                                <h3 className="font-semibold text-lg">{e.title}</h3>
                                <p className="text-sm text-gray-400">
                                    {e.date} • {e.time}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={`/events/${e._id}/edit`}
                                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => setOpenId(e._id)}
                                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>

                            <Link
                                href={`/events/${e._id}`}
                                className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {openId && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] p-8 rounded-xl w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4 text-white">
                            Delete Event?
                        </h2>
                        <p className="text-gray-300 mb-6">
                            This action is irreversible. Are you sure you want to delete this
                            event?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setOpenId(null)}
                                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageEvents;
