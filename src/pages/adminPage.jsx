import { Link, NavLink, Route, Routes } from "react-router-dom";
import { FaArrowLeft, FaHouse, FaShoppingCart } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
import AdminProducts from "./admin/adminproducts.jsx";
import AddProductsForm from "./admin/adminaddproductsform.jsx";
import EditProduct from "./admin/admineditproduct.jsx";

export default function AdminPage(){
    const adminNavClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

    return(
        <div className="flex h-screen w-full overflow-hidden bg-[#06111f] text-slate-100 shadow-2xl">
            {/* The sidebar provides navigation for the admin area. */}
            <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-cyan-900/70 bg-[#071522] p-4">
                <div className="flex items-center gap-3 border-b border-cyan-900/70 px-2 pb-6">
                    <img src="/logologin.png" alt="Logo" className="h-12 w-16 rounded-lg object-cover" />
                    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">TechNest</p><span className="text-xl font-black text-white">Admin panel</span></div>
                </div>
                <nav className="mt-8 space-y-2" aria-label="Admin navigation">
                    <NavLink to="/admin" end className={adminNavClass}><FaShoppingCart />Orders</NavLink>
                    <NavLink to="/admin/users" className={adminNavClass}><FaUser />User management</NavLink>
                    <NavLink to="/admin/products" className={adminNavClass}><LuPackageOpen />Products</NavLink>
                </nav>
                <div className="mt-auto border-t border-cyan-900/70 pt-4"><Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"><FaHouse />Back to storefront</Link><Link to="/" className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:text-cyan-300"><FaArrowLeft />Exit admin</Link></div>
            </aside>
            {/* Nested routes render the selected admin page in the main panel. */}
            <main className="h-screen flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,#123b58_0%,#06111f_48%,#040a14_100%)] text-white">
                <Routes>
                    <Route index element={<div className="p-8 lg:p-12"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Control center</p><h1 className="mt-2 text-4xl font-black text-white">Admin dashboard</h1><p className="mt-3 max-w-xl text-slate-400">Manage your store catalogue, users, and daily operations from one place.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Link to="/admin/products" className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400"><LuPackageOpen className="text-2xl text-cyan-300" /><h2 className="mt-5 text-xl font-black">Products</h2><p className="mt-2 text-sm text-slate-400">Add, edit, and manage your catalogue.</p></Link><Link to="/admin/users" className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400"><FaUser className="text-2xl text-cyan-300" /><h2 className="mt-5 text-xl font-black">Users</h2><p className="mt-2 text-sm text-slate-400">Review customer account access.</p></Link><Link to="/" className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400"><FaHouse className="text-2xl text-cyan-300" /><h2 className="mt-5 text-xl font-black">Storefront</h2><p className="mt-2 text-sm text-slate-400">Return to the customer shopping experience.</p></Link></div></div>} />
                    <Route path="users" element={<div className="p-8 lg:p-12"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Administration</p><h1 className="mt-2 text-4xl font-black">User management</h1></div>} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="add-product" element={<AddProductsForm />} />
                    <Route path="edit-product/:productID" element={<EditProduct />} />
                </Routes>
            </main>
        </div>
    )
}