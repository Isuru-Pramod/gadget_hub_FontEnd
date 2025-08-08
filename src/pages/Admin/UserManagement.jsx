import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";

// Admin Sidebar Component
const AdminSidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col fixed h-full py-6">
            <div className="flex-1 overflow-y-auto">
                <h1 className="text-2xl font-bold text-orange-400 px-6">Admin Panel</h1>
                <h1 className="text-xl font-bold text-orange-100 mb-8 px-6">{user?.username}</h1>
                <nav className="flex flex-col gap-4 px-6">
                    <Link to="/admin" className="hover:text-orange-400">Product Management</Link>
                    <Link to="/orderManagement" className="hover:text-orange-400">Order Management</Link>
                    <Link to="/userManagement" className="hover:text-orange-400">User Management</Link>
                </nav>
            </div>
            <div className="px-6 pb-6">
                <button 
                    onClick={handleLogout} 
                    className="w-full bg-orange-500 text-black py-2 font-bold rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

// Main Page Component
export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.username) return;

        axios.get("http://localhost:5131/api/Auth")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                toast.error("Failed to load users");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [user.username]);

const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:5131/api/Auth/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("User deleted successfully");
    } catch (error) {
        toast.error("Failed to delete user");
        console.error(error);
    }
};


    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 p-8 ml-64">
                <h2 className="text-3xl font-bold text-orange-600 mb-6">User Management</h2>

                {loading ? (
                    <p className="text-gray-500">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="text-gray-500">No users found.</p>
                ) : (
                    <div className="space-y-4">
                        {users.map((u) => (
                            <div key={u.id} className="bg-white shadow p-4 rounded border border-gray-200 relative">
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete User"
                                    >
                                        <RiDeleteBin6Line size={20} />
                                    </button>
                                </div>
                                <p><strong>Username:</strong> {u.username}</p>
                                <p><strong>Full Name:</strong> {u.fullName}</p>
                                <p><strong>Email:</strong> {u.email}</p>
                                <p><strong>Role:</strong> {u.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
