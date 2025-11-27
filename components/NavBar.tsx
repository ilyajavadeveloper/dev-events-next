import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <header className="w-full py-5 border-b border-[#262626]">
            <nav className="max-w-6xl mx-auto flex items-center justify-between px-4">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 logo">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                    <p className="font-bold text-xl">DevEvent</p>
                </Link>

                {/* NAV LINKS */}
                <ul className="flex items-center gap-10 text-gray-300 font-medium">
                    <Link href="/" className="hover:text-white transition">
                        Home
                    </Link>

                    <Link href="/events" className="hover:text-white transition">
                        Events
                    </Link>

                    <Link href="/events/create" className="hover:text-white transition">
                        Create Event
                    </Link>

                    {/* 🔥 NEW: ADMIN PANEL */}
                    <Link href="/events/manage" className="hover:text-white transition">
                        Manage
                    </Link>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
