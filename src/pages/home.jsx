import Header from "../components/header";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { useNavigate } from "react-router-dom";

export default function Home() {
     const [state, setState] = useState("loading");
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios.get("http://localhost:5131/api/products")
            .then((res) => {
                setItems(res.data);
                setState("success");
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || "An error occurred");
                console.error(err);
                setState("error");
            });
    }, []);

    const handleAddToCart = (item) => {
        setCartItems((prev) => {
            const existing = prev.find(p => p.id === item.id);
            if (existing) {
                return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        toast.success(`${item.name} added to cart!`);
    };

    const handleIncrement = (id) => {
        setCartItems((prev) => prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
    };

    const handleDecrement = (id) => {
        setCartItems((prev) =>
            prev.map(p => p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p)
        );
    };

    const handleRemove = (id) => {
        setCartItems((prev) => prev.filter(p => p.id !== id));
    };

    const handlePlaceOrder = () => {
        if (!user || user.role !== "customer") {
            toast.error("You must be logged in to place an order");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const quotationRequest = {
            customerUsername: user.username,
            productOrders: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            distributors: ["techworld", "electrocom", "gadgetcentral"]
        };

        axios.post("http://localhost:5131/api/quotations/request", quotationRequest)
            .then(res => {
                toast.success("Quotation sent successfully", {
                    icon: '🚀',
                    duration: 4000,
                });
                setCartItems([]);
            })
            .catch(err => {
                toast.error("Failed to place quotation request");
                console.error(err);
            });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            
            <div className=" flex">
                <div className="w-3/4 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Amazing Gadgets</h1>
                        <p className="text-gray-600">Find the perfect tech for your needs</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 justify-center">
                        {state === "loading" && (
                            <div className="w-full h-64 flex justify-center items-center">
                                <div className="w-12 h-12 border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {state === "success" && items.map(item => (
                            <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                        ))}

                        {state === "error" && (
                            <div className="w-full py-12 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Failed to load products</h3>
                                <p className="text-gray-600">Please try refreshing the page</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-1/4 sticky top-20 h-[calc(100vh-5rem)] p-4">
                    <Cart
                        cartItems={cartItems}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        onRemove={handleRemove}
                        onPlaceOrder={handlePlaceOrder}
                    />
                </div>
            </div>
        </div>
    );
}