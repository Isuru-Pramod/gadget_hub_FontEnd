import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
        <div  className="flex mr-[20px]">
            <div>
                {user && (
                <Link to="/massage">
                    <img 
                        src="./public/pending.png" 
                        alt="msgIcon" 
                        className="w-[40px] h-[40px] ml-[20px] hover:scale-105 transition-transform duration-300 hover:bg-white active:scale-95 active:bg-orange-300"
                    />
                </Link>
                
            )}
            </div>
                        <div>
                {user && (
                <Link to="/confirmedOrders">
                    <img 
                        src="./public/confirm.png" 
                        alt="msgIcon" 
                        className="w-[40px] h-[40px] ml-[20px] hover:scale-105 transition-transform duration-300 hover:bg-white active:scale-95 active:bg-orange-300"
                    />
                </Link>
                
            )}
            </div>
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
