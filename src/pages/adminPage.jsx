import { Link, Route, Routes } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
export default function AdminPage(){
    return(
        <div className="flex h-screen w-full text-black shadow-2xl">
            <div className="w-90 h-full flex flex-col">
                <div className="w-full h-20 bg-blue-900 flex items-center justify-between px-4 mb-2">
                    <img src="/logologin.png" alt="Logo" className="h-16 w-24 justify-between" />
                    <span className="text-2xl font-bold text-amber-100">ADMIN</span>
                </div>
                <Link to="/admin" className="w-full flex items-center gap-2 text-2xl p-2 hover:bg-blue-700 hover:text-white"><FaShoppingCart className="text-2xl" />Orders</Link>
                <Link to="/admin/users" className="w-full flex items-center gap-2 text-2xl p-2 hover:bg-blue-700 hover:text-white"><FaUser className="text-2xl" />User Management</Link>
                <Link to="/admin/products" className="w-full flex items-center gap-2 text-2xl p-2 hover:bg-blue-700 hover:text-white"><LuPackageOpen className="text-2xl" />Products</Link>
            </div>
            <div className="w-[calc(100%-360px)] h-full bg-gray-300 text-black">
                <Routes>
                    <Route index element={<h1>Admin Dashboard</h1>} />
                    <Route path="/users" element={<h1>User Management</h1>} />
                    <Route path="/products" element={<h1>Products</h1>} />
                </Routes>
            </div>
        </div>
    )
}