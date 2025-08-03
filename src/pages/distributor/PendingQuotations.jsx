import DistributorSidebar from "../../components/DistributorSidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PendingQuotations() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formStates, setFormStates] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios.get("http://localhost:5131/api/quotations/all")
            .then(res => {
                const pending = res.data.filter(q => q.distributor === user.username && q.status === "Pending");
                setQuotations(pending);
            })
            .catch(err => {
                toast.error("Failed to fetch quotations");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [user.username]);

    const handleChange = (productId, field, value) => {
        setFormStates(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value
            }
        }));
    };

    const handleSubmit = (productId) => {
        const form = formStates[productId];
        if (!form?.price || !form?.available || !form?.days) {
            toast.error("Please fill in all fields");
            return;
        }

        axios.post("http://localhost:5131/api/quotations/respond", {
            distributor: user.username,
            productId,
            pricePerUnit: parseFloat(form.price),
            availableUnits: parseInt(form.available),
            estimatedDeliveryDays: parseInt(form.days)
        }).then(() => {
            toast.success("Response submitted");
            setQuotations(prev => prev.filter(q => q.productId !== productId));
        }).catch(() => {
            toast.error("Submission failed");
        });
    };

    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Pending Quotations</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : quotations.length === 0 ? (
                    <p>No pending quotations.</p>
                ) : (
                    <div className="space-y-6">
                        {quotations.map(q => (
                            <div key={q.productId} className="bg-white p-4 rounded shadow">
                                <p><strong>Product ID:</strong> {q.productId}</p>
                                <p><strong>Quantity Requested:</strong> {q.quantityRequested}</p>

                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <input type="number" placeholder="Price per Unit"
                                        className="border rounded px-3 py-2"
                                        onChange={e => handleChange(q.productId, "price", e.target.value)} />

                                    <input type="number" placeholder="Available Units"
                                        className="border rounded px-3 py-2"
                                        onChange={e => handleChange(q.productId, "available", e.target.value)} />

                                    <input type="number" placeholder="Delivery Days"
                                        className="border rounded px-3 py-2"
                                        onChange={e => handleChange(q.productId, "days", e.target.value)} />
                                </div>

                                <button onClick={() => handleSubmit(q.productId)}
                                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
                                    Submit Response
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
