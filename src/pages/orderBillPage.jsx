import { FaArrowLeft, FaDownload, FaPrint, FaReceipt } from "react-icons/fa6";
import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/header";
import api from "../lib/api";
import { getAuth } from "../lib/auth";
import { getStoredOrders } from "../lib/orders";

function formatDate(value) {
    return value ? new Date(value).toLocaleString() : "-";
}

function getBillMarkup(order) {
    const items = (order.items || []).map((item) => `<tr><td>${item.name || item.productID || "Product"}</td><td>${item.quantity}</td><td>${item.price === undefined ? "-" : `$${Number(item.price).toFixed(2)}`}</td></tr>`).join("");
    return `<!doctype html><html><head><meta charset="UTF-8"><title>TechNest bill ${order.orderId}</title><style>body{font-family:Arial,sans-serif;color:#172033;max-width:760px;margin:40px auto;padding:0 20px}header{border-bottom:3px solid #0891b2;padding-bottom:20px}h1{margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{text-align:left;padding:12px;border-bottom:1px solid #dbe3ed}th{background:#f1f5f9}.total{text-align:right;font-size:22px;font-weight:bold;margin-top:24px}.muted{color:#64748b}</style></head><body><header><h1>TechNest bill</h1><p class="muted">Order ${order.orderId}</p><p class="muted">${formatDate(order.createdAt)}</p></header><h2>Delivery details</h2><p>${order.firstName || ""} ${order.lastName || ""}<br>${order.address || ""}<br>${order.district || ""}, ${order.postalCode || ""}, ${order.country || "Sri Lanka"}<br>${order.phoneNumber || ""}</p><h2>Items</h2><table><thead><tr><th>Product</th><th>Quantity</th><th>Unit price</th></tr></thead><tbody>${items}</tbody></table><p class="total">Total: $${Number(order.total || 0).toFixed(2)}</p></body></html>`;
}

export default function OrderBillPage() {
    const { orderId } = useParams();
    const auth = getAuth();
    const [order, setOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!auth || !orderId) return;
        async function loadOrder() {
            try {
                const response = await api.get(`/orders/${encodeURIComponent(orderId)}`);
                const loadedOrder = response.data?.order || response.data;
                const isOwner = loadedOrder.customerEmail && auth.user?.email && loadedOrder.customerEmail.toLowerCase() === auth.user.email.toLowerCase();
                if (!auth.isAdmin && loadedOrder.customerEmail && !isOwner) {
                    setErrorMessage("You can only view bills for your own orders.");
                    return;
                }
                setOrder(loadedOrder);
            } catch (error) {
                const storedOrder = getStoredOrders(auth.user?.email).find((item) => item.orderId === orderId);
                if (storedOrder) setOrder(storedOrder);
                else setErrorMessage(error.response?.data?.message || "Could not load this bill.");
            }
        }
        loadOrder();
    }, [auth?.token, orderId]);

    if (!auth) return <Navigate to="/login" replace />;
    const backLink = auth.isAdmin ? "/admin/orders" : "/profile";
    if (errorMessage) return <div className="min-h-screen bg-slate-50"><Header /><main className="mx-auto max-w-2xl px-5 py-20 text-center"><p className="text-red-600">{errorMessage}</p><Link to={backLink} className="mt-6 inline-block font-bold text-sky-600">{auth.isAdmin ? "Back to admin" : "Back to account"}</Link></main></div>;
    if (!order) return <div className="min-h-screen bg-slate-50"><Header /><main className="flex min-h-[65vh] items-center justify-center text-slate-500">Loading bill...</main></div>;

    const downloadBill = () => {
        const blob = new Blob([getBillMarkup(order)], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `technest-${order.orderId}-bill.html`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bill-shell min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe,#f8fafc_42%,#eef2f7)] text-slate-800">
            <Header />
            <main className="bill-page mx-auto max-w-3xl px-5 py-10 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Link to={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600"><FaArrowLeft /> {auth.isAdmin ? "Back to admin" : "Back to account"}</Link><div className="flex gap-2"><button type="button" onClick={downloadBill} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold hover:border-sky-400 hover:text-sky-600"><FaDownload /> Download</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-sky-600"><FaPrint /> Print</button></div></div>
                <article className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70"><header className="flex flex-col gap-4 bg-slate-950 p-7 text-white sm:flex-row sm:items-start sm:justify-between sm:p-10"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">TechNest bill</p><h1 className="mt-2 text-3xl font-black">Order receipt</h1><p className="mt-2 text-slate-300">{order.orderId}</p></div><div className="text-sm sm:text-right"><p className="font-bold text-amber-300">{order.status || "Pending"}</p><p className="mt-1 text-slate-300">{formatDate(order.createdAt)}</p></div></header><div className="space-y-8 p-7 sm:p-10"><div className="grid gap-5 border-b border-slate-200 pb-7 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer</p><p className="mt-2 font-bold text-slate-950">{order.firstName} {order.lastName}</p><p className="text-sm text-slate-600">{order.phoneNumber}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery address</p><p className="mt-2 text-sm text-slate-600">{order.address}<br />{order.district}, {order.postalCode}<br />{order.country || "Sri Lanka"}</p></div></div><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><FaReceipt /> Ordered products</div><div className="mt-4 divide-y divide-slate-100">{(order.items || []).map((item, index) => <div key={item.productID || index} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name || item.productID || "Product"} <strong className="text-slate-400">x{item.quantity}</strong></span><span className="font-bold">{item.price === undefined ? "" : `$${Number(item.price * item.quantity).toFixed(2)}`}</span></div>)}</div></div><div className="flex justify-between border-t border-slate-200 pt-5 text-xl font-black"><span>Total</span><span>${Number(order.total || 0).toFixed(2)}</span></div></div></article>
            </main>
        </div>
    );
}
