import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RiHome2Fill } from "react-icons/ri";
import { FaBusinessTime } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";

export default function Massage() {
    const [groupedQuotations, setGroupedQuotations] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch both quotations and products
                const [quotationsResponse, productsResponse] = await Promise.all([
                    axios.get("http://localhost:5131/api/quotations/all"),
                    axios.get("http://localhost:5131/api/products")
                ]);

                // Create products lookup object
                const productsData = productsResponse.data.reduce((acc, product) => {
                    acc[product.id] = product;
                    return acc;
                }, {});

                setProducts(productsData);

                // Filter and group quotations
                const customerQuotations = quotationsResponse.data.filter(
                    q => q.customerUsername === user.username && q.status === "Pending"
                );

                const grouped = customerQuotations.reduce((acc, quotation) => {
                    const key = `${quotation.productId}-${quotation.quantityRequested}`;
                    if (!acc[key]) {
                        acc[key] = {
                            productId: quotation.productId,
                            quantityRequested: quotation.quantityRequested,
                            quotationIds: [],
                            distributors: []
                        };
                    }
                    acc[key].quotationIds.push(quotation.id);
                    acc[key].distributors.push(quotation.distributor);
                    return acc;
                }, {});

                setGroupedQuotations(Object.values(grouped));
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load data");
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleCancelQuotation = async (quotationIds) => {
        try {
            await Promise.all(
                quotationIds.map(id => 
                    axios.delete(`http://localhost:5131/api/Quotations/delete-quotation/${id}`)
                )
            );
            
            setGroupedQuotations(prev => 
                prev.filter(group => !quotationIds.includes(group.quotationIds[0]))
            );
            
            toast.success("Quotation request cancelled successfully");
        } catch (error) {
            toast.error("Failed to cancel quotation");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 w-screen h-screen">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 rounded-lg shadow-lg
                h-[80px] w-screen flex items-center justify-between"> 
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
        className="p-2 text-gray-800 hover:text-gray-600 bg-amber-500  transition-colors duration-200 relative group rounded-full"
        aria-label="Appointments"
      >
        <FaBusinessTime className="w-6 h-6" />
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Appointments
        </span>
      </Link>
      
      <Link 
        to="/confirmedOrders" 
        className="p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200 relative group"
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
                
                <div className="w-[200px]">

                </div>        
            </div>
            <div className="flex-1 p-3">
                <div className="grid grid-cols-1 gap-4 w-full h-full p-6 m-[20px] rounded-2xl shadow-2xl bg-white">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4">Pending Quotations</h2>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : groupedQuotations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No pending quotations found</p>
                    ) : (
                        <div className="space-y-6">
                            {groupedQuotations.map((group) => {
                                const product = products[group.productId];
                                return (
                                    <div key={group.quotationIds[0]} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            {product?.imageData ? (
                                                <img 
                                                    src={`http://localhost:5131/api/products/${group.productId}/image`}
                                                    alt={product?.name}
                                                    className="w-24 h-24 object-contain rounded-lg border"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-500">No Image</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div>
                                                    <p className="font-semibold">Product</p>
                                                    <p>{product?.name || "Unknown Product"}</p>
                                                    <p className="text-sm text-gray-500">ID: {group.productId}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Quantity</p>
                                                    <p>{group.quantityRequested}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <button
                                                onClick={() => handleCancelQuotation(group.quotationIds)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
                                            >
                                                Cancel Request
                                            </button>
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