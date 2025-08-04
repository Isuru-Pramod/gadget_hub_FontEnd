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
            const res = await axios.post("http://localhost:5131/api/auth/login", {
                username,
                password
            });

            const user = res.data;
            localStorage.setItem("user", JSON.stringify(user));
            toast.success(`Welcome back, ${user.username}!`);

            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "distributor") {
                navigate("/distributor/ADashboard");
            } else if (user.role === "customer") {
                navigate("/");
            } else {
                toast.error("Unknown role");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md px-6 py-8">
                <div className="bg-white rounded-[5px] shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-orange-200 p-6 text-center border-b border-blur-300">
                        <h1 className="text-3xl font-bold text-gray-900">
                            <a href="/" className="hover:text-orange-600 transition">GadgetHub</a>
                        </h1>
                        <p className="text-gray-700 mt-1 text-sm">Sign in to your account</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-orange-600 text-black py-3 rounded-lg font-medium hover:bg-red-700 transition transform hover:scale-[1.01] shadow-md"
                        >
                            Login
                        </button>
                        
                        <div className="text-center pt-4">
                            <p className="text-gray-600 text-sm">
                                If you don't have an account{" "}
                                <a href="/register" 
                                    className="text-blue-600 font-medium hover:underline hover:text-orange-700 transition">
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}