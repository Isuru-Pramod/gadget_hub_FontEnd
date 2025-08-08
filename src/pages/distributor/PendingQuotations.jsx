
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DistributorNavBar from "../../components/DistributorSidebar";

export default function PendingQuotations() {
    const [groupedQuotations, setGroupedQuotations] = useState({});
    const [inputs, setInputs] = useState({});

    // Get user data from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username;

    // Fetch pending quotations for the logged-in distributor.
    useEffect(() => {
        if (!username) return;

        axios.get("http://localhost:5131/api/quotations/all")
            .then((res) => {
                const pending = res.data.filter(
                    (q) => q.distributor.toLowerCase() === username.toLowerCase() && q.status === "Pending"
                );
                const grouped = {};
                pending.forEach((q) => {
                    if (!grouped[q.customerUsername]) grouped[q.customerUsername] = [];
                    grouped[q.customerUsername].push(q);
                });
                setGroupedQuotations(grouped);
            })
            .catch(() => toast.error("Failed to load quotations"));
    }, [username]);

    // Handle changes in the input fields.
    const handleInputChange = (quotationId, field, value) => {
        setInputs((prev) => ({
            ...prev,
            [quotationId]: {
                ...prev[quotationId],
                [field]: value,
            },
        }));
    };

    // Handle submitting a response for a single item.
    const handleSubmitItem = (customer, item) => {
        const input = inputs[item.id];
        if (!input?.price || !input?.units || !input?.days) {
            toast.error("Please fill all fields to respond.");
            return;
        }

        axios.post("http://localhost:5131/api/quotations/respond-batch", {
            distributor: username,
            customerUsername: customer,
            responses: [
                {
                    productId: item.productId,
                    isRejected: false,
                    pricePerUnit: parseFloat(input.price),
                    availableUnits: parseInt(input.units),
                    estimatedDeliveryDays: parseInt(input.days),
                },
            ],
        })
            .then(() => {
                toast.success("Response submitted successfully");
                setGroupedQuotations((prev) => {
                    const updated = { ...prev };
                    updated[customer] = updated[customer].filter((q) => q.id !== item.id);
                    if (updated[customer].length === 0) delete updated[customer];
                    return updated;
                });
            })
            .catch(() => toast.error("Submission failed"));
    };

    // Handle rejecting a single item.
    const handleRejectItem = (customer, item) => {
        // As per instructions, removed window.confirm and proceeding directly with API call.
        axios.post("http://localhost:5131/api/quotations/respond-batch", {
            distributor: username,
            customerUsername: customer,
            responses: [
                {
                    productId: item.productId,
                    isRejected: true,
                },
            ],
        })
            .then(() => {
                toast.success("Item rejected successfully");
                setGroupedQuotations((prev) => {
                    const updated = { ...prev };
                    updated[customer] = updated[customer].filter((q) => q.id !== item.id);
                    if (updated[customer].length === 0) delete updated[customer];
                    return updated;
                });
            })
            .catch(() => toast.error("Rejection failed"));
    };
    
    // Helper function to calculate total units and total price for a customer's items.
    const calculateTotals = (items) => {
        let totalUnits = 0;
        let totalPrice = 0;

        items.forEach(item => {
            const input = inputs[item.id];
            // Use 0 as a default value if inputs are not yet defined to prevent NaN.
            const price = parseFloat(input?.price || 0);
            const units = parseInt(input?.units || 0);

            totalUnits += units;
            totalPrice += price * units;
        });
        
        return { totalUnits, totalPrice };
    };

    return (
        <div className="flex min-h-screen font-sans">
            <DistributorNavBar />
            <div className="flex-1 ml-64 p-6 bg-gray-100 overflow-y-auto">
                {/* Check if there are any quotations to display */}
                {Object.entries(groupedQuotations).length === 0 ? (
                    <div className="flex items-center justify-center min-h-full">
                        <p className="text-xl text-gray-500">No pending quotations found.</p>
                    </div>
                ) : (
                    Object.entries(groupedQuotations).map(([customer, items]) => {
                        const { totalUnits, totalPrice } = calculateTotals(items);

                        return (
                            <div key={customer} className="bg-white shadow-lg rounded-md mb-6 border border-gray-300">
                                {/* Customer heading with a gray background */}
                                <div className="bg-gray-200 px-4 py-3 rounded-t-md">
                                    <h3 className="text-xl font-semibold">Customer: {customer}</h3>
                                </div>
                                <div className="p-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex flex-col md:flex-row border-t py-4 first:border-t-0 md:items-center">
                                            {/* Product details section */}
                                            <div className="w-full md:w-1/3 flex items-start gap-4 mb-4 md:mb-0">
                                                <img
                                                    src={`http://localhost:5131/api/products/${item.productId}/image`}
                                                    alt={item.productName}
                                                    className="w-24 h-24 object-cover border rounded-md"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/e5e7eb/7f8287?text=No+Image" }}
                                                />
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-sm">Product Id: <span className="font-normal">{item.productId}</span></p>
                                                    <p className="font-semibold text-sm">Product Name: <span className="font-normal">{item.productName}</span></p>
                                                    <p className="font-semibold text-sm">Category: <span className="font-normal">{item.category}</span></p>
                                                    <p className="text-red-500 font-semibold text-sm">Quantity Requested: <span className="font-normal">{item.quantityRequested}</span></p>
                                                </div>
                                            </div>
                                            {/* Input fields and action buttons section */}
                                            <div className="w-full md:w-2/3 flex flex-col md:flex-row items-center justify-between pl-0 md:pl-6">
                                                {/* Input fields aligned horizontally on desktop, stacked on mobile */}
                                                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto mb-4 md:mb-0">
                                                    <input
                                                        type="number"
                                                        placeholder="Price per item (Rs.)"
                                                        className="border p-2 rounded-md w-full md:w-40"
                                                        onChange={(e) => handleInputChange(item.id, "price", e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Available unit"
                                                        className="border p-2 rounded-md w-full md:w-40"
                                                        onChange={(e) => handleInputChange(item.id, "units", e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Delivery days"
                                                        className="border p-2 rounded-md w-full md:w-40"
                                                        onChange={(e) => handleInputChange(item.id, "days", e.target.value)}
                                                    />
                                                </div>
                                                {/* Action buttons stacked vertically */}
                                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleSubmitItem(customer, item)}
                                                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                                    >
                                                        Submit response
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectItem(customer, item)}
                                                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Total units and total price display */}
                                    <div className="flex flex-col md:flex-row justify-end items-end mt-4 border-t pt-4 gap-2 md:gap-4">
                                        <p className="text-lg font-semibold">All units: <span className="font-normal">{totalUnits}</span></p>
                                        <p className="text-lg font-semibold">Total price: <span className="text-red-500">Rs {totalPrice.toFixed(2)}</span></p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

