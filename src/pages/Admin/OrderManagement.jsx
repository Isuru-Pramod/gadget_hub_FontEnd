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
export default function OrderManagement() {
    const [responses, setResponses] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.username) return;

        axios.get("http://localhost:5131/api/Quotations/all-quotations")
            .then(async (res) => {
                setResponses(res.data);

                // fetch unique product details
                const productMap = {};
                const uniqueProductIds = [...new Set(res.data.map((r) => r.productId))];

                await Promise.all(uniqueProductIds.map(async (id) => {
                    try {
                        const response = await axios.get(`http://localhost:5131/api/Products/${id}`);
                        productMap[id] = response.data;
                    } catch (err) {
                        console.error(`Failed to fetch product ${id}`, err);
                    }
                }));

                setProducts(productMap);
            })
            .catch(err => {
                toast.error("Failed to load quotations.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [user.username]);


    const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

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
        if (status === "Pending") return "text-yellow-600";
        if (status === "Received") return "text-blue-600";
        return "text-gray-500";
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 p-8 ml-64">
                <h2 className="text-3xl font-bold text-orange-600 mb-6">All Quotations</h2>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : responses.length === 0 ? (
                    <p className="text-gray-500">No quotations available.</p>
                ) : (
                    <div className="space-y-4">
                        {responses.map((r) => {
                            const product = products[r.productId];
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

                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24">
                                            {product?.id ? (
                                                <img
                                                    src={`http://localhost:5131/api/Products/${product.id}/image`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <p><strong>Quotation ID:</strong> {r.id}</p>
                                            <p><strong>Product:</strong> {product?.name || r.productId}</p>
                                            <p><strong>Customer:</strong> {r.customerUsername}</p>
                                            <p><strong>Distributor:</strong> {r.distributor}</p>
                                            <p><strong>Requested Quantity:</strong> {r.quantityRequested}</p>
                                            <p><strong>Price Per Unit:</strong> Rs. {r.pricePerUnit?.toFixed(2) || "-"}</p>
                                            <p><strong>Available Units:</strong> {r.availableUnits ?? "-"}</p>
                                            <p><strong>Estimated Delivery:</strong> {r.estimatedDeliveryDays ? `${r.estimatedDeliveryDays} days` : "-"}</p>
                                            <p className={`${getStatusStyle(statusText)} font-semibold`}>Status: {statusText}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
