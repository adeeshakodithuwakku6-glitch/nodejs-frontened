import { Link, Route, Routes } from "react-router-dom";
export default function AdminPage(){
    return(
        <div className="flex h-screen w-full text-white">
            <div className="w-90 h-full bg-red-900 flex flex-col">
                <h1>Hi! Admin</h1>
                <Link to="/admin">← Admin Dashboard</Link>
                <Link to="/admin/users">User Management</Link>
                <Link to="/admin/products">Products</Link>
            </div>
            <div className="w-[calc(100%-360px)] h-full bg-yellow-300 text-black">
                <Routes>
                    <Route index element={<h1>Admin Dashboard</h1>} />
                    <Route path="/users" element={<h1>User Management</h1>} />
                    <Route path="/products" element={<h1>Products</h1>} />
                </Routes>
            </div>
        </div>
    )
}