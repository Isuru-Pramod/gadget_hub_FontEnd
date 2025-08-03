import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        console.log({ username, password });

        const res = await axios.post("http://localhost:5131/api/auth/login", {
        username,
        password
        });

        const user = res.data;

        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Logged in as ${user.role}`);

        if (user.role === "admin") {
        navigate("/admin");
        } else if (user.role === "distributor") {
        navigate("/distributor/ADashboard");
        } else if (user.role === "customer") {
        navigate("/customer");
        } else {
        toast.error("Unknown role");
        }
    } catch (err) {
        toast.error(err?.response?.data?.message || "Login failed");
    }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-[400px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to GadgetHub</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring"
                    required
                />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Login
                </button>
            </form>
        </div>
    );
}
