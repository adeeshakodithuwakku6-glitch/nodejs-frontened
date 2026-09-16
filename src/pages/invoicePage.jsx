import { FaArrowLeft, FaFileInvoiceDollar, FaPrint } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/header";

const INVOICE_STORAGE_KEY = "technest-latest-invoice";

export default function InvoicePage() {
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        try {
            setInvoice(JSON.parse(localStorage.getItem(INVOICE_STORAGE_KEY) || "null"));
        } catch (error) {
            console.error("Could not read invoice:", error);
        }
    }, []);

    if (!invoice) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <Header />
                <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
                    <FaFileInvoiceDollar className="text-5xl text-sky-500" />
                    <h1 className="mt-5 text-3xl font-black text-slate-950">No invoice found</h1>
                    <Link to="/" className="mt-6 font-bold text-sky-600 hover:text-sky-800">Return to the store</Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600"><FaArrowLeft /> Back to store</Link>
                    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-sky-600"><FaPrint /> Print invoice</button>
                </div>
                <article className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70">
                    <div className="flex flex-col gap-5 bg-slate-950 p-7 text-white sm:flex-row sm:items-start sm:justify-between sm:p-10">
                        <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">TechNest invoice</p><h1 className="mt-2 text-3xl font-black">Order confirmed</h1><p className="mt-2 text-sm text-slate-300">Thank you, {invoice.customer.name}.</p></div>
                        <div className="text-left text-sm sm:text-right"><p className="font-bold text-amber-300">{invoice.invoiceNumber}</p><p className="mt-1 text-slate-300">{new Date(invoice.createdAt).toLocaleString()}</p><p className="mt-2 font-bold text-emerald-300">Cash on delivery</p></div>
                    </div>
                    <div className="space-y-8 p-7 sm:p-10">
                        <div className="grid gap-5 border-b border-slate-200 pb-7 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Deliver to</p><p className="mt-2 font-bold text-slate-950">{invoice.customer.name}</p><p className="text-sm text-slate-600">{invoice.customer.phone}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</p><p className="mt-2 text-sm text-slate-600">{invoice.customer.address}</p></div></div>
                        <div className="space-y-4">{invoice.items.map((item) => <div key={item.productID} className="flex justify-between gap-4 text-sm"><span className="text-slate-600">{item.name} <strong className="text-slate-400">x{item.quantity}</strong></span><span className="font-bold text-slate-950">${(item.price * item.quantity).toFixed(2)}</span></div>)}</div>
                        <div className="flex justify-between border-t border-slate-200 pt-5 text-xl font-black text-slate-950"><span>Total due on delivery</span><span>${invoice.total.toFixed(2)}</span></div>
                    </div>
                </article>
                <button type="button" onClick={() => navigate("/")} className="mx-auto mt-8 block font-bold text-sky-600 hover:text-sky-800">Continue shopping</button>
            </main>
        </div>
    );
}

export { INVOICE_STORAGE_KEY };
