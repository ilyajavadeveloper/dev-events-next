"use client";

import { useState } from "react";
import { loginAdmin } from "@/lib/actions/admin.actions";

const AdminLoginForm = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        const res = await loginAdmin(password);

        if (res.success) {
            window.location.href = "/admin";
        } else {
            setError("Incorrect password");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="password"
                placeholder="Enter admin password"
                className="input bg-[#111] text-white border border-[#333]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                className="btn-primary"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    );
};

export default AdminLoginForm;
