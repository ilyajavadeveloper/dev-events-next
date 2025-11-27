import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
    return (
        <section className="flex justify-center items-center h-screen">
            <div className="bg-[#1a1a1a] p-8 rounded-xl w-full max-w-md shadow-lg">
                <h1 className="text-2xl font-bold text-white mb-4">Admin Login</h1>
                <AdminLoginForm />
            </div>
        </section>
    );
}
