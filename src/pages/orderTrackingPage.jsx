import { FaArrowLeft, FaBox, FaLocationDot, FaRotate } from "react-icons/fa6";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/header";
import api from "../lib/api";
import { getAuth } from "../lib/auth";

const statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

function getTrackingError(error) {
    const status = error.response?.status;
    if (status === 401) return "Your session has expired. Please log in again.";
    if (status === 400) return error.response?.data?.message || "Please enter a valid order ID.";
    if (status === 403) return "You can only track orders belonging to your account.";
    if (status === 404) return "Order not found. Check the order ID and try again.";
    if (status === 500) return "The server could not load this order. Please try again shortly.";
    return error.response?.data?.message || "Could not load the order.";
}

export default function OrderTrackingPage() {
    const { orderId: routeOrderId } = useParams();
    const navigate = useNavigate();
    const auth = getAuth();
    const [orderId, setOrderId] = useState(routeOrderId || "");
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(Boolean(routeOrderId));
    const [errorMessage, setErrorMessage] = useState("");
    const [statusUpdateMessage, setStatusUpdateMessage] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Pending");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const loadOrder = async (requestedOrderId = orderId) => {
        const cleanOrderId = requestedOrderId.trim();
        if (!cleanOrderId) {
            setErrorMessage("Enter an order ID to track your order.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setOrder(null);
        try {
            const response = await api.get(`/orders/${encodeURIComponent(cleanOrderId)}`);
            const loadedOrder = response.data?.order || response.data;
            const orderEmail = loadedOrder.customerEmail || loadedOrder.email;
            const userEmail = auth.user?.email;

            if (auth.isAdmin) {
                setOrder(loadedOrder);
            } else if (!orderEmail || !userEmail || orderEmail.toLowerCase() !== userEmail.toLowerCase()) {
                setErrorMessage("You can only track orders belonging to your account.");
                return;
            } else {
                setOrder(loadedOrder);
            }

            if (cleanOrderId !== routeOrderId) navigate(`/orders/${encodeURIComponent(cleanOrderId)}`, { replace: true });
        } catch (error) {
            console.error("Could not load order:", error);
            setErrorMessage(getTrackingError(error));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (routeOrderId) loadOrder(routeOrderId);
    }, [routeOrderId]);

    useEffect(() => {
        if (order?.status) {
            setSelectedStatus(order.status);
        }
    }, [order?.status]);

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    const handleStatusUpdate = async () => {
        if (!order?.orderId || !auth?.isAdmin) return;

        setIsUpdatingStatus(true);
        setStatusUpdateMessage("");

        try {
            const response = await api.patch(`/orders/${encodeURIComponent(order.orderId)}/status`, {
                status: selectedStatus,
            });

            const updatedOrder = response.data?.order || { ...order, status: selectedStatus };
            setOrder(updatedOrder);
            setStatusUpdateMessage("Order status updated successfully.");
        } catch (error) {
            console.error("Could not update order status:", error);
            setStatusUpdateMessage(error.response?.data?.message || "Could not update order status.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const currentStatus = order?.status || "Pending";
    const currentStatusIndex = statuses.indexOf(currentStatus);
    const isCancelled = currentStatus.toLowerCase() === "cancelled";
    const backLink = auth.isAdmin ? "/admin/orders" : "/";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
                <Link to={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600"><FaArrowLeft /> {auth.isAdmin ? "Back to all orders" : "Back to store"}</Link>
                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Order tracking</p><h1 className="mt-2 text-3xl font-black text-slate-950">Find your order</h1><form onSubmit={(event) => { event.preventDefault(); loadOrder(); }} className="mt-6 flex flex-col gap-3 sm:flex-row"><input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="ORD-..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /><button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"><FaRotate className={isLoading ? "animate-spin" : ""} />{isLoading ? "Loading..." : "Track order"}</button></form></section>
                {errorMessage && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}{errorMessage.includes("log in") && <Link to="/login" className="ml-1 font-bold underline">Log in</Link>}</div>}
                {statusUpdateMessage && <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{statusUpdateMessage}</div>}
                {order && <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-950 p-6 text-white sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Order</p><h2 className="mt-1 text-2xl font-black">{order.orderId}</h2></div><span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${isCancelled ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{currentStatus}</span></div>{auth?.isAdmin && <div className="border-b border-slate-200 bg-slate-50 p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-bold text-slate-700">Update status<select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-500"><option value="Pending">Pending</option><option value="Confirmed">Confirmed</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option></select></label><button type="button" onClick={handleStatusUpdate} disabled={isUpdatingStatus} className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60">{isUpdatingStatus ? "Updating..." : "Save status"}</button></div></div>}<div className="grid gap-3 border-b border-slate-200 p-6 sm:grid-cols-5">{statuses.map((status, index) => <div key={status} className={`rounded-xl p-3 text-center text-sm font-bold ${index <= currentStatusIndex ? (status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700") : "bg-slate-100 text-slate-400"}`}>{status}</div>)}</div><div className="grid gap-6 border-b border-slate-200 p-6 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer</p><p className="mt-2 font-bold text-slate-900">{order.firstName || "-"} {order.lastName || ""}</p><p className="mt-1 text-sm text-slate-600">Phone: {order.phoneNumber || "-"}</p>{order.secondaryPhoneNumber && <p className="text-sm text-slate-600">Secondary: {order.secondaryPhoneNumber}</p>}</div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery details</p><p className="mt-2 flex gap-2 text-slate-700"><FaLocationDot className="mt-1 shrink-0 text-sky-500" />{order.address || "-"}</p><p className="mt-1 text-sm text-slate-600">{order.district || "-"}, {order.postalCode || "-"}, {order.country || "Sri Lanka"}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Dates</p><p className="mt-2 text-sm text-slate-600">Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</p><p className="text-sm text-slate-600">Updated: {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "-"}</p></div>{order.notes && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes</p><p className="mt-2 text-sm text-slate-700">{order.notes}</p></div>}</div><div className="border-t border-slate-200 p-6"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><FaBox /> Ordered products</div><div className="mt-4 space-y-3">{(order.items || []).map((item, index) => <div key={item.productID || item._id || index} className="flex justify-between gap-4 text-sm"><span className="text-slate-700">{item.name || item.productName || item.productID || "Product"} <strong className="text-slate-400">x{item.quantity}</strong></span>{item.price !== undefined && <span className="font-bold text-slate-950">${Number(item.price * item.quantity).toFixed(2)}</span>}</div>)}</div><div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-xl font-black text-slate-950"><span>Total</span><span>${Number(order.total || 0).toFixed(2)}</span></div></div></section>}
            </main>
        </div>
    );
}
