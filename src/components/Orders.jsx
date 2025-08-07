import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const username = localStorage.getItem("username");
                if (!username) {
                    navigate("/login");
                    return;
                }
                
                const response = await axios.get(`/api/orders/customer/${username}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <div 
                        key={order.orderId} 
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/orders/quotation-status?orderId=${order.orderId}`)}
                    >
                        <h3 className="font-semibold">Order #{order.orderId}</h3>
                        <p>Status: {order.status}</p>
                        <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}