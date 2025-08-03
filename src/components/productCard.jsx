import { Link } from "react-router-dom";

export default function ProductCard({ item, onAddToCart }) {
    const imageUrl = `http://localhost:5131/api/products/${item.id}/image`;

    return (
        <div className="relative w-[300px] h-[450px] bg-white rounded-2xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
            <div className="w-full h-48 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-t-2xl"
                />
            </div>
            <div className="p-4 flex flex-col justify-between h-[calc(100%-192px)]">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                </div>
                <p className="mt-3 text-gray-700 text-sm leading-snug">
                    {item.description?.length > 100 
                        ? item.description.slice(0, 100) + "..." 
                        : item.description}
                </p>
                <button
                    onClick={() => onAddToCart(item)}
                    className="mt-auto w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-emerald-700 transition-colors duration-300"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
