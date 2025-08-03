import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DistributorDashboard() {
    const [activeTab, setActiveTab] = useState("pending");
    const [quotations, setQuotations] = useState([]);
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
    const distributor = JSON.parse(localStorage.getItem("user"))?.username;
    const role = JSON.parse(localStorage.getItem("user"))?.role;

    useEffect(() => {
        if (!distributor || role !== "distributor") {
            navigate("/login");
            return;
        }

        axios.get("http://localhost:5131/api/quotations/all")
            .then(res => {
                const all = res.data.filter(q => q.distributor.toLowerCase() === distributor.toLowerCase());
                setQuotations(all.filter(q => q.status === "Pending"));
                setResponses(all.filter(q => q.status === "Received"));
            })
            .catch(err => console.error(err));
    }, [distributor, role, navigate]);

    const handleRespond = async (id, productId, price, units, days) => {
        try {
            await axios.post("http://localhost:5131/api/quotations/respond", {
                distributor,
                productId,
                pricePerUnit: parseFloat(price),
                availableUnits: parseInt(units),
                estimatedDeliveryDays: parseInt(days)
            });
            alert("Response sent!");
            window.location.reload();
        } catch (err) {
            alert("Failed to respond.");
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-[220px] bg-orange-600 text-white p-5 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-6">Distributor Dashboard</h2>
                    <nav className="flex flex-col gap-3">
                        <button onClick={() => setActiveTab("pending")} className={`text-left px-3 py-2 rounded ${activeTab === "pending" ? "bg-black" : "hover:bg-orange-700"}`}>Pending Quotations</button>
                        <button onClick={() => setActiveTab("responded")} className={`text-left px-3 py-2 rounded ${activeTab === "responded" ? "bg-black" : "hover:bg-orange-700"}`}>My Responses</button>
                        <button onClick={() => setActiveTab("orders")} className={`text-left px-3 py-2 rounded ${activeTab === "orders" ? "bg-black" : "hover:bg-orange-700"}`}>Orders Awarded</button>
                        <button onClick={() => setActiveTab("profile")} className={`text-left px-3 py-2 rounded ${activeTab === "profile" ? "bg-black" : "hover:bg-orange-700"}`}>Profile Info</button>
                    </nav>
                </div>
                <button onClick={handleLogout} className="text-left px-3 py-2 rounded hover:bg-red-600">Logout</button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                <h1 className="text-2xl font-bold mb-4 text-black">Welcome, {distributor}</h1>

                {activeTab === "pending" && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-black">Pending Quotations</h2>
                        {quotations.length === 0 ? <p>No pending requests.</p> : quotations.map((q, index) => (
                            <div key={index} className="bg-orange-100 p-4 rounded shadow mb-4">
                                <p><strong>Product ID:</strong> {q.productId}</p>
                                <p><strong>Requested Qty:</strong> {q.quantityRequested}</p>
                                <form className="mt-2 flex gap-2 flex-wrap" onSubmit={(e) => {
                                    e.preventDefault();
                                    const price = e.target.price.value;
                                    const units = e.target.units.value;
                                    const days = e.target.days.value;
                                    handleRespond(index, q.productId, price, units, days);
                                }}>
                                    <input name="price" type="number" step="0.01" placeholder="Price per unit" required className="px-2 py-1 border rounded" />
                                    <input name="units" type="number" placeholder="Available units" required className="px-2 py-1 border rounded" />
                                    <input name="days" type="number" placeholder="Delivery days" required className="px-2 py-1 border rounded" />
                                    <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Respond</button>
                                </form>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "responded" && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-black">My Responses</h2>
                        {responses.length === 0 ? <p>No responses yet.</p> : responses.map((r, index) => (
                            <div key={index} className="bg-orange-100 p-4 rounded shadow mb-3">
                                <p><strong>Product ID:</strong> {r.productId}</p>
                                <p><strong>Price:</strong> {r.pricePerUnit}</p>
                                <p><strong>Available Units:</strong> {r.availableUnits}</p>
                                <p><strong>Delivery in:</strong> {r.estimatedDeliveryDays} days</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "orders" && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-black">Orders Awarded</h2>
                        <p>Coming soon: Display awarded orders here.</p>
                    </div>
                )}

                {activeTab === "profile" && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3 text-black">Profile Information</h2>
                        <p><strong>Username:</strong> {distributor}</p>
                        <p><strong>Role:</strong> Distributor</p>
                        <p><strong>Email:</strong> (add if available)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
