import { Link } from "react-router-dom";

export default function ProductCard({ item, onAddToCart }) {
    const imageUrl = `http://localhost:5131/api/products/${item.id}/image`;

    return (
        <div className="relative w-72 h-[28rem] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="relative w-full h-60 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{item.name}</h2>
                    <p className="text-gray-600 text-sm my-3 line-clamp-3">
                        {item.description}
                    </p>
                </div>
                
                <div className="mt-auto mb-2 flex items-center justify-between">
                    <p className="text-orange-600 font-semibold text-lg">
                        {item.category}
                    </p>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}