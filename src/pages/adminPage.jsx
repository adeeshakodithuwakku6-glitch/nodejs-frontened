import { Link, NavLink, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaBullhorn, FaCartShopping, FaHouse, FaMagnifyingGlass, FaSpinner } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";
import api from "../lib/api";
import { getAuth } from "../lib/auth";
import techNestLogo from "../assets/Tech Nest logo.jfif";
import { getAllStoredOrders } from "../lib/orders";
import AdminProducts from "./admin/adminproducts.jsx";
import AddProductsForm from "./admin/adminaddproductsform.jsx";
import EditProduct from "./admin/admineditproduct.jsx";
import AdminUsers from "./admin/adminusers.jsx";
import OrderBillPage from "./orderBillPage.jsx";
import OrderTrackingPage from "./orderTrackingPage.jsx";
import AdminAnnouncements from "./admin/adminAnnouncements.jsx";

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchOrders() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/orders/admin", {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });

                if (isMounted) {
                    setOrders(Array.isArray(response.data) ? response.data : []);
                }
            } catch (error) {
                if (!isMounted) return;

                const status = error.response?.status;
                if (status === 401) {
                    setErrorMessage("Unauthorized. Please log in with an admin account.");
                } else if (status === 403) {
                    setErrorMessage("Access denied. This account does not have admin privileges.");
                } else {
                    setErrorMessage(error.response?.data?.message || "Could not load orders.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredOrders = orders.filter((order) => {
        const query = search.toLowerCase().trim();
        if (!query) return true;

        const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim();
        const customerEmail = order.customer?.email || "";
        const orderId = order.orderId || "";

        return [orderId, customerName, customerEmail, order.status || ""].some((field) =>
            (field || "").toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff,#eef4ff_35%,#e7eefb_100%)] p-6 text-slate-700">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white/80 p-5 shadow-lg shadow-blue-100 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Store orders</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin Orders</h1>
                    </div>

                    <div className="relative w-full max-w-md">
                        <label htmlFor="admin-order-search" className="sr-only">Search orders</label>
                        <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                            id="admin-order-search"
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by order ID, customer, status"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-inner outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-lg shadow-slate-200/80">
                        <FaSpinner className="mx-auto h-6 w-6 animate-spin text-sky-600" />
                        <p className="mt-4 text-lg font-semibold">Loading orders...</p>
                    </div>
                ) : errorMessage ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-lg shadow-red-100/80">
                        <p className="text-lg font-bold">Unable to load orders</p>
                        <p className="mt-2">{errorMessage}</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-lg shadow-slate-200/80">
                        <p className="text-lg font-semibold">No orders found</p>
                        <p className="mt-2">There are no orders matching your current search.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/80">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-900 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                                        <th className="px-4 py-3">Order ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr key={order.orderId || index} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                                            <td className="px-4 py-3 font-semibold text-slate-900">{order.orderId || "-"}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-slate-900">{`${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() || "Unknown customer"}</div>
                                                <div className="text-xs text-slate-500">{order.customer?.email || "No email"}</div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900">${Number(order.total || 0).toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    (order.status || "Pending") === "Delivered"
                                                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                                        : (order.status || "Pending") === "Cancelled"
                                                            ? "bg-red-100 text-red-700 ring-1 ring-red-200"
                                                            : "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                                                }`}>
                                                    {order.status || "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/admin/orders/${encodeURIComponent(order.orderId)}`} className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-700">View</Link>
                                                    <Link to={`/admin/orders/${encodeURIComponent(order.orderId)}/bill`} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-sky-400 hover:text-sky-700">Bill</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminPage(){
    const [receivedOrders, setReceivedOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const auth = getAuth();
    const isAdmin = Boolean(auth?.isAdmin ?? auth?.isadmin ?? auth?.user?.isAdmin ?? auth?.user?.isadmin);
    const adminName = auth?.user?.firstName || auth?.user?.firstname || auth?.firstName || auth?.firstname || "Admin";
    const adminNavClass = ({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

    useEffect(() => {
        let isMounted = true;

        async function loadOrders() {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/orders/admin", {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                const serverOrders = response.data?.orders || response.data || [];
                if (Array.isArray(serverOrders) && isMounted) {
                    setReceivedOrders(serverOrders);
                }
            } catch (error) {
                console.error("Could not load received orders:", error);
                if (isMounted) {
                    setReceivedOrders(getAllStoredOrders());
                }
            } finally {
                if (isMounted) {
                    setOrdersLoading(false);
                }
            }
        }

        loadOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    const stats = useMemo(() => {
        const totalRevenue = receivedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const pending = receivedOrders.filter((order) => String(order.status || "Pending").toLowerCase() === "pending").length;
        const shipped = receivedOrders.filter((order) => String(order.status || "Pending").toLowerCase() === "shipped").length;

        return {
            totalOrders: receivedOrders.length,
            totalRevenue,
            pending,
            shipped,
        };
    }, [receivedOrders]);

    if (!auth) {
        return <div className="flex min-h-screen items-center justify-center bg-[#06111f] p-6 text-center text-white"><div><h1 className="text-3xl font-black">Please log in</h1><p className="mt-3 text-slate-400">You need an administrator account to open this page.</p><Link to="/login" className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Go to login</Link></div></div>;
    }

    if (!isAdmin) {
        return <div className="flex min-h-screen items-center justify-center bg-[#06111f] p-6 text-center text-white"><div><h1 className="text-3xl font-black">Access denied</h1><p className="mt-3 text-slate-400">Only administrators can open this page.</p><Link to="/" className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Back to storefront</Link></div></div>;
    }

    return(
        <div className="flex min-h-screen w-full flex-col bg-[#06111f] text-slate-100 shadow-2xl md:h-screen md:flex-row md:overflow-hidden">
            {/* The sidebar provides navigation for the admin area. */}
            <aside className="sticky top-0 z-10 flex w-full shrink-0 flex-col border-b border-cyan-900/70 bg-[#071522] p-4 md:h-screen md:w-72 md:border-b-0 md:border-r">
                <div className="flex items-center gap-3 border-b border-cyan-900/70 px-2 pb-4 md:pb-6">
                    <img src={techNestLogo} alt="TechNest logo" className="h-12 w-16 rounded-lg object-cover" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">TechNest</p>
                        <span className="text-xl font-black text-white">Admin panel</span>
                        <p className="mt-1 text-sm font-semibold text-cyan-200">Hi! {adminName}</p>
                    </div>
                </div>
                <nav className="mt-4 grid grid-cols-2 gap-2 md:mt-8 md:block md:space-y-2" aria-label="Admin navigation">
                    <NavLink to="/admin" end className={adminNavClass}><FaCartShopping />Orders</NavLink>
                    <NavLink to="/admin/orders" className={adminNavClass}><FaCartShopping />Admin Orders</NavLink>
                    <NavLink to="/admin/users" className={adminNavClass}><FaUser />User management</NavLink>
                    <NavLink to="/admin/products" className={adminNavClass}><LuPackageOpen />Products</NavLink>
                    <NavLink to="/admin/announcements" className={adminNavClass}><FaBullhorn />Announcements</NavLink>
                </nav>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-cyan-900/70 pt-4 md:mt-auto md:block"><Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"><FaHouse />Back to storefront</Link><Link to="/" className="mt-0 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:text-cyan-300 md:mt-2"><FaArrowLeft />Exit admin</Link></div>
            </aside>
            {/* Nested routes render the selected admin page in the main panel. */}
            <main className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,#123b58_0%,#06111f_48%,#040a14_100%)] text-white md:h-screen">
                <Routes>
                    <Route index element={<div className="p-8 lg:p-12"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Control center</p><h1 className="mt-2 text-4xl font-black text-white">Hi! {adminName}</h1><p className="mt-3 max-w-xl text-slate-400">Manage your store catalogue, users, and daily operations from one place.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Link to="/admin/products" className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400"><LuPackageOpen className="text-2xl text-cyan-300" /><h2 className="mt-5 text-xl font-black">Products</h2><p className="mt-2 text-sm text-slate-400">Add, edit, and manage your catalogue.</p></Link><Link to="/admin/users" className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400"><FaUser className="text-2xl text-cyan-300" /><h2 className="mt-5 text-xl font-black">Users</h2><p className="mt-2 text-sm text-slate-400">Review customer account access.</p></Link><Link to="/" className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-400"><FaHouse className="text-2xl text-cyan-300" /><h2 className="mt-5 text-xl font-black">Storefront</h2><p className="mt-2 text-sm text-slate-400">Return to the customer shopping experience.</p></Link></div><div className="mt-10 grid gap-5 lg:grid-cols-3"><div className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Received</p><p className="mt-3 text-3xl font-black text-white">{stats.totalOrders}</p><p className="mt-1 text-sm text-slate-400">Total orders</p></div><div className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Pending</p><p className="mt-3 text-3xl font-black text-white">{stats.pending}</p><p className="mt-1 text-sm text-slate-400">Awaiting review</p></div><div className="rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Revenue</p><p className="mt-3 text-3xl font-black text-white">${stats.totalRevenue.toFixed(2)}</p><p className="mt-1 text-sm text-slate-400">Collected value</p></div></div><section className="mt-10 rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Received orders</p><h2 className="mt-2 text-2xl font-black text-white">Recent orders</h2></div><span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">{stats.shipped} shipped</span></div>{ordersLoading ? <p className="mt-6 text-slate-400">Loading received orders...</p> : receivedOrders.length === 0 ? <p className="mt-6 text-slate-400">No orders have been received yet.</p> : <div className="mt-6 space-y-3">{receivedOrders.slice(0, 6).map((order) => <div key={order.orderId || order._id || order.id || order.orderID || Math.random()} className="flex flex-col gap-3 rounded-xl border border-cyan-900/70 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-white">{order.orderId || order._id || order.id || order.orderID || "Order"}</p><p className="mt-1 text-sm text-slate-400">{order.customerEmail || order.email || "Customer email unavailable"}</p><p className="mt-1 text-xs text-slate-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable"}</p></div><div className="flex items-center gap-3"><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">{order.status || "Pending"}</span><span className="text-lg font-black text-cyan-300">${Number(order.total || 0).toFixed(2)}</span></div></div>)}</div>}</section></div>} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="orders/:orderId" element={<OrderTrackingPage />} />
                    <Route path="orders/:orderId/bill" element={<OrderBillPage />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="announcements" element={<AdminAnnouncements />} />
                    <Route path="add-product" element={<AddProductsForm />} />
                    <Route path="edit-product/:productID" element={<EditProduct />} />
                </Routes>
            </main>
        </div>
    )
}