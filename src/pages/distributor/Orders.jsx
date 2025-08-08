import { useEffect, useState } from "react";
import axios from "axios";
import DistributorSidebar from "../../components/DistributorSidebar";
import { toast } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function Orders() {
    const [awardedOrders, setAwardedOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.username || user.role !== "distributor") return;

        axios
            .get("http://localhost:5131/api/Orders/order-statuses")
            .then(async (res) => {
                const filteredOrders = res.data.filter(
                    (order) =>
                        order.selectedDistributor?.toLowerCase() === user.username.toLowerCase() &&
                        order.status === "ChosenOne"
                );
                setAwardedOrders(filteredOrders);

                const productMap = {};
                const uniqueProductIds = [...new Set(filteredOrders.map((o) => o.productId))];

                await Promise.all(
                    uniqueProductIds.map(async (id) => {
                        try {
                            const response = await axios.get(`http://localhost:5131/api/Products/${id}`);
                            productMap[id] = response.data;
                        } catch (err) {
                            console.error("Failed to fetch product", id);
                        }
                    })
                );

                setProducts(productMap);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Failed to load awarded orders");
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    const getDeliveryDate = (orderDate, days) => {
        const date = new Date(orderDate);
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString();
    };

    const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this awarded order?")) return;

    try {
        await axios.delete(`http://localhost:5131/api/Orders/order-statuses/${id}`);
        setAwardedOrders(prev => prev.filter(order => order.id !== id));
        toast.success("Awarded order deleted successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to delete the awarded order.");
    }
};


    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 ml-64 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Orders Awarded</h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : awardedOrders.length === 0 ? (
                    <p className="text-gray-600">No awarded orders found.</p>
                ) : (
                    <div className="space-y-4">
                        {awardedOrders.map((order) => {
                            const product = products[order.productId];
                            return (
                                <div key={order.id} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                        <div>
                                            {product?.id ? (
                                                <img
                                                    src={`http://localhost:5131/api/Products/${product.id}/image`}
                                                    alt={product.name}
                                                    className="w-24 h-24 object-cover border rounded"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 animate-pulse rounded"></div>
                                            )}
                                        </div>
                                   

                                        <div>
                                            <p className="text-sm text-gray-600">Product</p>
                                            <p className="font-semibold">{product?.name || order.productId}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-semibold">{order.customerUsername}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600">Quantity</p>
                                            <p className="font-semibold">{order.quantity}</p>
                                            <p className="text-sm text-gray-600 mt-1">Unit Price</p>
                                            <p className="font-semibold text-green-700">Rs {order.pricePerUnit}</p>
                                        </div>

                                        <div>
                                            <div className="flex justify-end">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors text-xl"
                                                title="Delete Order"
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                            <p className="text-sm text-gray-600">Delivery in</p>
                                            <p className="font-semibold">{order.estimatedDeliveryDays} days</p>
                                            <p className="text-sm text-gray-600 mt-1">Receive By</p>
                                            <p className="font-semibold text-blue-700">{getDeliveryDate(order.orderDate, order.estimatedDeliveryDays)}</p>
                                            <p className="text-sm text-green-600 font-bold mt-1">✅ Confirmed</p>

                                            
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
