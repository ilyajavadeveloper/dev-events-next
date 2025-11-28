export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex">

            {/* SIDEBAR */}
          z  <aside className="w-64 border-r border-gray-800 p-6 space-y-8">
                <h2 className="text-xl font-bold">Admin Panel</h2>

                <nav className="space-y-4">
                    <a href="/admin" className="block hover:text-blue-400">Dashboard</a>
                    <a href="/events/manage" className="block hover:text-blue-400">Events</a>
                    <a href="/events/create" className="block hover:text-blue-400">Create Event</a>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10">{children}</main>
        </div>
    );
}
