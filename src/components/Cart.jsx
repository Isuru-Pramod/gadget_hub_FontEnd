export default function Cart({ cartItems, onIncrement, onDecrement, onRemove, onPlaceOrder }) {
    return (
        <div className="w-full p-4 bg-white">
            <h2 className="text-xl font-bold mb-4">Your Cart ({cartItems.length} items)</h2>
            {cartItems.map((item) => (
                <div key={item.id} className="mb-4 border-b pb-3">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onDecrement(item.id)}
                                className="w-8 h-8 bg-gray-200 text-lg font-bold rounded hover:bg-gray-300"
                            >-</button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => onIncrement(item.id)}
                                className="w-8 h-8 bg-gray-200 text-lg font-bold rounded hover:bg-gray-300"
                            >+</button>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-6 text-right">
                <button
                    onClick={onPlaceOrder}
                    disabled={cartItems.length === 0}
                    className="w-full py-2 bg-orange-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}
