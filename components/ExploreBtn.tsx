"use client";

import Image from "next/image";

const ExploreBtn = () => {
    return (
        <a
            href="#events"
            className="mt-7 mx-auto flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition"
        >
            Explore Events
            <Image
                src="/icons/arrow-down.svg"
                alt="arrow-down"
                width={24}
                height={24}
            />
        </a>
    );
};

export default ExploreBtn;
