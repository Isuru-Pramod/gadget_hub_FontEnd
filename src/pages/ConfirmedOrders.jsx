import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RiHome2Fill } from "react-icons/ri";
import { FaBusinessTime } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ConfirmedOrders() {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    

    useEffect(() => {
        if (!user?.username) return;

        axios
            .get(`http://localhost:5131/api/Quotations/customer-orders?username=${user.username}`)
            .then(async (res) => {
                const orders = res.data;
                setConfirmedOrders(orders);

                const productMap = {};
                const uniqueIds = [...new Set(orders.map((o) => o.productId))];

                await Promise.all(
                    uniqueIds.map(async (id) => {
                        try {
                            const productRes = await axios.get(`http://localhost:5131/api/Products/${id}`);
                            productMap[id] = productRes.data;
                        } catch (err) {
                            console.error("Failed to fetch product", id, err);
                        }
                    })
                );

                setProducts(productMap);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Failed to fetch confirmed orders");
                console.error(err);
                setLoading(false);
            });
    }, [user]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString();

    const getDeliveryDate = (orderDate, days) => {
        const date = new Date(orderDate);
        date.setDate(date.getDate() + days);
        return formatDate(date.toISOString());
    };

        const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this awarded order?")) return;

    try {
        await axios.delete(`http://localhost:5131/api/Orders/order-statuses/${id}`);
        setAwardedOrders(prev => prev.filter(order => order.id !== id));
        toast.success("deleted successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to delete");
    }
};



    return (
        <div className="flex flex-col bg-gray-100 w-screen min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 rounded-lg shadow-lg h-[80px] w-screen flex items-center justify-between"> 
<div className="flex items-center gap-4 px-4 py-3 bg-orange-200 rounded-full shadow-sm ml-[20px]">
  <Link 
    to="/" 
    className="p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200"
    aria-label="Home"
  >
    <RiHome2Fill className="w-6 h-6" />
  </Link>
  
  {user && (
    <>

      
      <Link 
        to="/massage" 
        className="p-2 text-gray-800 hover:text-gray-600   transition-colors duration-200 relative group rounded-full"
        aria-label="Appointments"
      >
        <FaBusinessTime className="w-6 h-6" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Appointments
        </span>
      </Link>
      
      <Link 
        to="/confirmedOrders" 
        className="p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200 relative group bg-amber-500 rounded-full"
        aria-label="Confirmed Orders"
      >
        <BsCartCheckFill className="w-6 h-6" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          My Orders
        </span>
      </Link>
    </>
  )}
</div>
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
                            {confirmedOrders.map((order) => {
                                const product = products[order.productId];

                                return (
                                    <div key={order.id} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                            {/* Image */}
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
                                            

                                            {/* Product Info */}
                                            <div>
                                                <p className="text-sm text-gray-600">Product</p>
                                                <p className="font-semibold">{product?.name || order.productId}</p>
                                            </div>

                                            {/* Quantity & Price */}
                                            <div>
                                                <p className="text-sm text-gray-600">Quantity</p>
                                                <p className="font-semibold">{order.quantity}</p>

                                                <p className="text-sm text-gray-600 mt-1">Unit Price</p>
                                                <p className="font-semibold text-green-700">Rs {order.pricePerUnit}</p>
                                            </div>

                                            {/* Delivery Info */}
                                            <div>
                                                <p className="text-sm text-gray-600">Delivery</p>
                                                <p className="font-semibold">{order.estimatedDeliveryDays} days</p>
                                                <p className="text-sm text-gray-600 mt-1">Receive By</p>
                                                <p className="font-semibold text-blue-700">{getDeliveryDate(order.orderDate, order.estimatedDeliveryDays)}</p>
                                            </div>
                                            

                                            {/* Distributor Info */}
                                            <div>
                                                <p className="text-sm text-gray-600">Distributor</p>
                                                <p className="font-semibold capitalize">{order.selectedDistributor}</p>
                                                <p className="text-sm text-green-600 mt-1 font-bold">✅ Confirmed</p>
                                            </div>

                                            {/* Order Time */}
                                            <div>
                                                <p className="text-sm text-gray-600">Order Date</p>
                                                <p className="font-semibold">{formatDate(order.orderDate)}</p>
                                                <p className="text-xs text-gray-500">{formatTime(order.orderDate)}</p>
                                                <div className="flex justify-end">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors text-xl"
                                                title="Delete Order"
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                        </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
