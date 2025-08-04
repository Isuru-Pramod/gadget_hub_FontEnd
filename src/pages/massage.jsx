import { Link } from "react-router-dom";

export default function Massage() {
    return (
        <div className="flex flex-col">
            <div className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 rounded-lg shadow-lg
         h-[80px] w-screen flex items-center justify-between"> 
         <Link to="/">
            <img src="./public/home.png" alt="HomeIcon" className="w-[60px] h-[60px] ml-[20px] hover:scale-105 transition-transform duration-300 hover:bg-white active:scale-95 active:bg-orange-300"/>
         </Link>
            
            <div className="flex items-center">
                <Link to="/"><h1 className="text-3xl font-bold underline">GadgetHub</h1></Link>
            </div>
            
            <div>
            <Link to="/login">
            <button className="bg-gray-800 hover:bg-red-700 hover:scale-103 text-white font-bold py-2 px-4 mr-[10px] rounded">
                Login
            </button>
            </Link>
            <Link to="/register">
            <button className="bg-blue-600 hover:bg-white hover:scale-103 hover:text-blue-600 text-white font-bold py-2 px-4 mr-[30px] rounded">
                SignUp
            </button>
            </Link>
            </div>

            
        
        </div>
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Orders Status</h2>
            </div>
        </div>
    );
}

