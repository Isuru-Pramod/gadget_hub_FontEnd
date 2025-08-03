import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function DistributorSidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "distributor") {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="w-64 bg-black text-white min-h-screen flex flex-col justify-between py-6">
            <div>
                <h1 className="text-2xl font-bold text-orange-400 px-6">Distributor Panel </h1>
                <h1 className="text-2xl font-bold text-orange-100 mb-8 ml-7 px-6"><strong>{user?.username}</strong> </h1>
                
                <nav className="flex flex-col gap-4 px-6">
                    <Link to="/distributor/ADashboard" className="hover:text-orange-400">Pending Quotations</Link>
                    <Link to="/distributor/MyResponses" className="hover:text-orange-400">My Responses</Link>
                    <Link to="/distributor/OrdersAwarded" className="hover:text-orange-400">Orders Awarded</Link>
                    <Link to="/distributor/ProfileInfo" className="hover:text-orange-400">Profile Info</Link>
                </nav>
            </div>
            <div className="px-6">
                <button onClick={handleLogout} className="w-full bg-orange-500 text-black py-2 font-bold rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
        </div>
    );
}
