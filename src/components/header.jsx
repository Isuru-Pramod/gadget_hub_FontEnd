import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiHome2Fill } from "react-icons/ri";
import { FaBusinessTime } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";

export default function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <header className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 rounded-lg shadow-lg
         h-[80px] w-screen flex items-center justify-between sticky top-0 z-10"> 
<div className="flex items-center gap-4 px-4 py-3 bg-orange-200 rounded-full  shadow-sm ml-[20px]">
  <Link 
    to="/" 
    className="p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200 bg-amber-500 rounded-full"
    aria-label="Home"
  >
    <RiHome2Fill className="w-6 h-6" />
  </Link>
  
  {user && (
    <>

      
      <Link 
        to="/massage" 
        className="p-2 text-gray-800 hover:text-gray-600 transition-colors duration-200 relative group "
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
                <Link to="/">
                    <h1 className="text-3xl font-bold underline">Welcome to GadgetHub</h1>
                </Link>
            </div>

            <div className="flex items-center gap-4 mr-[30px]">
                {user ? (
                    <>
                        <span className="text-black font-medium">
                            Welcome, <span className="font-bold">👤{" "}{user.username}</span>
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="bg-gray-800 hover:bg-red-700 hover:text-white hover:scale-105 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="bg-gray-800 hover:bg-red-700 hover:scale-103 text-white font-bold py-2 px-4 mr-2 rounded">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-blue-600 hover:bg-white hover:scale-103 hover:text-blue-600 text-white font-bold py-2 px-4 rounded">
                                SignUp
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
