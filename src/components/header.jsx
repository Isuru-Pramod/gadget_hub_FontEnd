import { Link } from "react-router-dom";

export default function Header(){
    return(
        <header className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 rounded-lg shadow-lg
         h-[80px] w-screen flex items-center justify-between"> 
            <img src="https://cdn-icons-png.flaticon.com/512/107/107831.png" alt="logo" className="w-[40px] h-[40px] ml-[20px]"/>
            <div className="flex items-center">
                <Link to="/"><h1 className="text-3xl font-bold underline">Welcome to GadgetHub</h1></Link>
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

            
        
        </header>
    )
}