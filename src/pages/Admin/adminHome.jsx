import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col fixed h-full py-6">
            <div className="flex-1 overflow-y-auto">
                <h1 className="text-2xl font-bold text-orange-400 px-6">Admin Panel</h1>
                <h1 className="text-xl font-bold text-orange-100 mb-8 px-6">{user?.username}</h1>
                
                <nav className="flex flex-col gap-4 px-6">
                    <Link to="/admin" className="hover:text-orange-400">Product Management</Link>
                    <Link to="/admin/users" className="hover:text-orange-400">User Management</Link>
                </nav>
            </div>
            <div className="px-6 pb-6">
                <button 
                    onClick={handleLogout} 
                    className="w-full bg-orange-500 text-black py-2 font-bold rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        image: null
    });

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5131/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch products');
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    // Upload new product
    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Id', formData.id);
            formDataToSend.append('Name', formData.name);
            formDataToSend.append('Description', formData.description);
            formDataToSend.append('Category', formData.category);
            formDataToSend.append('Image', formData.image);

            const response = await axios.post('http://localhost:5131/api/products/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProducts([...products, response.data]);
            toast.success('Product uploaded successfully');
            setShowUploadModal(false);
            setFormData({
                id: '',
                name: '',
                description: '',
                category: '',
                image: null
            });
        } catch (error) {
            toast.error('Failed to upload product');
            console.error(error);
        }
    };

    // Start editing a product
    const startEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            image: null
        });
    };

    // Update a product
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedProduct = {
                id: editingProduct.id,
                name: formData.name,
                description: formData.description,
                category: formData.category
            };

            const response = await axios.put(`http://localhost:5131/api/products/${editingProduct.id}`, updatedProduct);
            
            setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
            toast.success('Product updated successfully');
            setEditingProduct(null);
        } catch (error) {
            toast.error('Failed to update product');
            console.error(error);
        }
    };

    // Delete a product
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5131/api/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            
            <div className="flex-1 p-8 ml-64"> {/* Added ml-64 to account for fixed sidebar width */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Upload New Product
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.imageData ? (
                                                    <img 
                                                        src={`http://localhost:5131/api/products/${product.id}/image`}
                                                        alt={product.name}
                                                        className="h-12 w-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                                        <span className="text-gray-500 text-xs">No Image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => startEdit(product)}
                                                    className=" hover:text-white mr-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className=" hover:text-white bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Upload Modal */}
                    {showUploadModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Upload New Product</h2>
                                        <button
                                            onClick={() => setShowUploadModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpload}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                            <input
                                                type="text"
                                                name="id"
                                                value={formData.id}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowUploadModal(false)}
                                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editingProduct && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                                        <button
                                            onClick={() => setEditingProduct(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <form onSubmit={handleUpdate}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setEditingProduct(null)}
                                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}