import DistributorSidebar from "../../components/DistributorSidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyResponses() {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.username) return;

        axios.get("http://localhost:5131/api/quotations/all")
            .then(res => {
                const responded = res.data.filter(q =>
                    q.distributor.toLowerCase() === user.username.toLowerCase() &&
                    q.status === "Received"
                );
                setResponses(responded);
            })
            .catch(err => {
                toast.error("Failed to load responses");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [user.username]);

    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 ml-64 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">My Responses</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : responses.length === 0 ? (
                    <p>No quotation responses submitted yet.</p>
                ) : (
                    <div className="space-y-4">
                        {responses.map((r) => (
                            <div key={r.id} className="bg-white shadow p-4 rounded border border-gray-200">
                                <p><strong>Product ID:</strong> {r.productId}</p>
                                <p><strong>Customer:</strong> {r.customerUsername}</p>
                                <p><strong>Requested Quantity:</strong> {r.quantityRequested}</p>
                                <p><strong>Price Per Unit:</strong> Rs. {r.pricePerUnit?.toFixed(2)}</p>
                                <p><strong>Available Units:</strong> {r.availableUnits}</p>
                                <p><strong>Delivery in:</strong> {r.estimatedDeliveryDays} days</p>
                                <p className="text-green-600 font-semibold mt-2">Status: {r.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
