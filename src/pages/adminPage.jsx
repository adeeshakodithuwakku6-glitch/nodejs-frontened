import { Link, Route, Routes } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
import AdminProducts from "./admin/adminproducts.jsx";
import AddProductsForm from "./admin/adminaddproductsform.jsx";

export default function AdminPage(){
    return(
        <div className="flex h-screen w-full overflow-hidden bg-gray-200 text-black shadow-2xl">
            <aside className="sticky top-0 flex h-screen w-90 shrink-0 flex-col bg-white">
                <div className="flex h-20 w-full items-center justify-between bg-blue-900 px-4 mb-2">
                    <img src="/logologin.png" alt="Logo" className="h-16 w-24 justify-between" />
                    <span className="text-2xl font-bold text-amber-100">ADMIN</span>
                </div>
                <Link to="/admin" className="flex w-full items-center gap-2 p-2 text-2xl hover:bg-blue-700 hover:text-white"><FaShoppingCart className="text-2xl" />Orders</Link>
                <Link to="/admin/users" className="flex w-full items-center gap-2 p-2 text-2xl hover:bg-blue-700 hover:text-white"><FaUser className="text-2xl" />User Management</Link>
                <Link to="/admin/products" className="flex w-full items-center gap-2 p-2 text-2xl hover:bg-blue-700 hover:text-white"><LuPackageOpen className="text-2xl" />Products</Link>
            </aside>
            <main className="h-screen flex-1 overflow-y-auto bg-gray-300 text-black">
                <Routes>
                    <Route index element={<h1>Admin Dashboard</h1>} />
                    <Route path="users" element={<h1>User Management</h1>} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="add-product" element={<AddProductsForm />} />
                </Routes>
            </main>
        </div>
    )
}