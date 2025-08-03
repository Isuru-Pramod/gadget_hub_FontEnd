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
            toast.error("You must be logged in for place an order");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
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
                toast.success("Quotation request sent to distributors!");
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
            <div className="flex">
                <div className="w-[75%] h-full flex flex-wrap justify-center pt-[50px] gap-6 px-4">
                    {state === "loading" && (
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="w-[50px] h-[50px] border-4 rounded-full border-t-orange-500 animate-spin"></div>
                        </div>
                    )}

                    {state === "success" && items.map(item => (
                        <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                    ))}

                    {state === "error" && (
                        <div className="text-red-500">Failed to load products.</div>
                    )}
                </div>

                <div className="w-[25%] h-screen bg-white shadow-inner overflow-y-auto">
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
