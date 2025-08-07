import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ConfirmedOrders() {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user?.username) return;

        axios
            .get(`http://localhost:5131/api/Quotations/customer-orders?username=${user.username}`)
            .then((res) => {
                setConfirmedOrders(res.data);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Failed to fetch confirmed orders");
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    return (
        <div className="flex flex-col bg-gray-100 w-screen min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 rounded-lg shadow-lg
                h-[80px] w-screen flex items-center justify-between"> 
                <Link to="/">
                    <img
                        src="./public/home.png"
                        alt="HomeIcon"
                        className="w-[60px] h-[60px] ml-[20px] hover:scale-105 transition-transform duration-300 hover:bg-white active:scale-95 active:bg-orange-300"
                    />
                </Link>

                <div className="flex items-center">
                    <Link to="/"><h1 className="text-3xl font-bold underline">GadgetHub</h1></Link>
                </div>

                <div className="w-[200px]"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-3">
                <div className="grid grid-cols-1 gap-4 w-full h-full p-6 m-[20px] rounded-2xl shadow-2xl bg-white">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4">Confirmed Orders</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : confirmedOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No confirmed orders found</p>
                    ) : (
                        <div className="space-y-4">
                            {confirmedOrders.map((order) => (
                                <div key={order.id} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Product ID</p>
                                            <p className="font-semibold">{order.productId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Distributor</p>
                                            <p className="font-semibold capitalize">{order.selectedDistributor}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Quantity</p>
                                            <p className="font-semibold">{order.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Unit Price</p>
                                            <p className="font-semibold text-green-700">Rs {order.pricePerUnit}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Delivery Days</p>
                                            <p className="font-semibold">{order.estimatedDeliveryDays} days</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className="font-semibold text-blue-700">{order.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Order Date</p>
                                            <p className="font-semibold">
                                                {new Date(order.orderDate).toLocaleDateString()} <br />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(order.orderDate).toLocaleTimeString()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
