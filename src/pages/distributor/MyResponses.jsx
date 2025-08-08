import DistributorSidebar from "../../components/DistributorSidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function MyResponses() {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.username) return;

        axios.get("http://localhost:5131/api/Quotations/all")
            .then(res => {
                const processed = res.data.filter(q =>
                    q.distributor?.toLowerCase() === user.username.toLowerCase() 
                  && (q.status === "Processed" || q.status === "Rejected")
                );
                setResponses(processed);
            })
            .catch(err => {
                toast.error("Failed to load your responses.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [user.username]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5131/api/Quotations/delete-quotation/${id}`);
            setResponses((prev) => prev.filter(q => q.id !== id));
            toast.success("Quotation deleted successfully");
        } catch (error) {
            toast.error("Failed to delete quotation");
            console.error(error);
        }
    };

    const getStatusStyle = (status) => {
        if (status === "Processed") return "text-green-600";
        if (status === "Rejected") return "text-red-500";
        return "text-gray-500";
    };

    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 ml-64 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">My Responses</h2>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : responses.length === 0 ? (
                    <p className="text-gray-500">No processed quotations found.</p>
                ) : (
                    <div className="space-y-4">
                        {responses.map((r) => {
                            const statusText = r.status;
                            return (
                                <div key={r.id} className="bg-white shadow p-4 rounded border border-gray-200 relative">
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete Quotation"
                                        >
                                            <RiDeleteBin6Line size={20} />
                                        </button>
                                    </div>

                                    <p><strong>Quotation ID:</strong> {r.id}</p>
                                    <p><strong>Customer:</strong> {r.customerUsername}</p>
                                    <p><strong>Product ID:</strong> {r.productId}</p>
                                    <p><strong>Requested Quantity:</strong> {r.quantityRequested}</p>
                                    <p><strong>Price Per Unit:</strong> Rs. {r.pricePerUnit?.toFixed(2)}</p>
                                    <p><strong>Available Units:</strong> {r.availableUnits}</p>
                                    <p><strong>Estimated Delivery:</strong> {r.estimatedDeliveryDays} days</p>
                                    <p className={`${getStatusStyle(statusText)} font-semibold mt-2`}>Status: {statusText}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
