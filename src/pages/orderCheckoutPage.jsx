import { FaArrowLeft, FaBoxOpen, FaCheck, FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import Header from "../components/header";
import api from "../lib/api";
import { clearCart, getCart, getCartTotal } from "../lib/cart";
import { getAuth } from "../lib/auth";
import { saveOrderForUser } from "../lib/orders";

const districts = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
    "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
    "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
];

const initialDetails = {
    firstName: "", lastName: "", address: "", postalCode: "", district: "", country: "Sri Lanka",
    phoneNumber: "", secondaryPhoneNumber: "", notes: "",
};

function getOrderError(error) {
    const status = error.response?.status;
    if (status === 401) return "Your session has expired. Please log in again.";
    if (status === 400) return error.response?.data?.message || "Please check your checkout details.";
    if (status === 404) return error.response?.data?.message || "A product in your cart could not be found.";
    if (status === 409) return error.response?.data?.message || "Stock changed while placing the order. Please review your cart.";
    if (status === 500) return "The server could not create your order. Please try again shortly.";
    return error.response?.data?.message || "Could not place your order. Please try again.";
}

export default function OrderCheckoutPage() {
    const [cart] = useState(getCart);
    const [details, setDetails] = useState(initialDetails);
    const [validationMessage, setValidationMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [order, setOrder] = useState(null);
    const token = localStorage.getItem("token");

    const placeOrder = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setValidationMessage("");

        if (!token) {
            setErrorMessage("Please log in before placing an order.");
            return;
        }

        if (cart.length === 0) {
            setErrorMessage("Your cart is empty.");
            return;
        }

        const requiredFields = ["firstName", "lastName", "address", "postalCode", "district", "phoneNumber"];
        const missingField = requiredFields.find((field) => !details[field].trim());
        if (missingField) {
            setValidationMessage("Please complete all required delivery fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post("/orders", {
                items: cart.map((item) => ({ productID: item.productID, quantity: item.quantity })),
                firstName: details.firstName.trim(),
                lastName: details.lastName.trim(),
                address: details.address.trim(),
                postalCode: details.postalCode.trim(),
                district: details.district,
                country: "Sri Lanka",
                phoneNumber: details.phoneNumber.trim(),
                ...(details.secondaryPhoneNumber.trim() && { secondaryPhoneNumber: details.secondaryPhoneNumber.trim() }),
                ...(details.notes.trim() && { notes: details.notes.trim() }),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const createdOrder = response.data?.order || response.data;
            setOrder(createdOrder);
            saveOrderForUser(getAuth()?.user?.email, createdOrder);
            clearCart();
            toast.success("Order placed successfully.");
        } catch (error) {
            console.error("Could not place order:", error);
            setErrorMessage(getOrderError(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (order) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800">
                <Header />
                <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-12 lg:px-8">
                    <section className="w-full rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-100 sm:p-12">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600"><FaCheck /></div>
                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Cash on delivery order</p>
                        <h1 className="mt-2 text-3xl font-black text-slate-950">Order placed</h1>
                        <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-left text-sm sm:grid-cols-2"><p><span className="text-slate-500">Order ID</span><br /><strong>{order.orderId}</strong></p><p><span className="text-slate-500">Total</span><br /><strong>${Number(order.total ?? 0).toFixed(2)}</strong></p><p><span className="text-slate-500">Status</span><br /><strong>{order.status || "Pending"}</strong></p><p><span className="text-slate-500">Deliver to</span><br /><strong>{order.firstName} {order.lastName}</strong></p></div>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to={`/orders/${encodeURIComponent(order.orderId)}`} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-sky-600">Track order</Link><Link to={`/orders/${encodeURIComponent(order.orderId)}/bill`} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">View bill</Link><Link to="/" className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:border-sky-400 hover:text-sky-600">Continue shopping</Link></div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
                <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600"><FaArrowLeft /> Back to cart</Link>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Checkout</p><h1 className="mt-2 text-3xl font-black text-slate-950">Cash on delivery</h1><p className="mt-2 text-slate-500">Your payment will be collected when your order arrives.</p>
                        {(errorMessage || validationMessage) && <div role="alert" className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><FaTriangleExclamation className="mt-0.5 shrink-0" /><span>{validationMessage || errorMessage}{(errorMessage.includes("log in") || validationMessage.includes("log in")) && <Link to="/login" className="ml-1 font-bold underline">Log in</Link>}</span></div>}
                        <form onSubmit={placeOrder} className="mt-8 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">First name *<input required value={details.firstName} onChange={(event) => setDetails({ ...details, firstName: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label><label className="text-sm font-bold text-slate-700">Last name *<input required value={details.lastName} onChange={(event) => setDetails({ ...details, lastName: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label></div><label className="block text-sm font-bold text-slate-700">Address *<textarea required minLength="5" value={details.address} onChange={(event) => setDetails({ ...details, address: event.target.value })} rows="3" className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Postal code *<input required value={details.postalCode} onChange={(event) => setDetails({ ...details, postalCode: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label><label className="text-sm font-bold text-slate-700">District *<select required value={details.district} onChange={(event) => setDetails({ ...details, district: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-500"><option value="">Select district</option>{districts.map((district) => <option key={district} value={district}>{district}</option>)}</select></label></div><label className="block text-sm font-bold text-slate-700">Country<input value="Sri Lanka" readOnly className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Phone number *<input required type="tel" value={details.phoneNumber} onChange={(event) => setDetails({ ...details, phoneNumber: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label><label className="text-sm font-bold text-slate-700">Secondary phone <span className="font-normal text-slate-400">(optional)</span><input type="tel" value={details.secondaryPhoneNumber} onChange={(event) => setDetails({ ...details, secondaryPhoneNumber: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label></div><label className="block text-sm font-bold text-slate-700">Notes <span className="font-normal text-slate-400">(optional)</span><textarea value={details.notes} onChange={(event) => setDetails({ ...details, notes: event.target.value })} rows="3" placeholder="Please deliver after 5 PM" className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></label><button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">{isSubmitting ? "Placing order..." : "Place order"}</button></form>
                    </section>
                    <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-xl"><div className="flex items-center gap-3"><FaBoxOpen className="text-xl text-cyan-300" /><h2 className="text-xl font-bold">Order summary</h2></div><div className="mt-6 space-y-4">{cart.map((item) => <div key={item.productID} className="flex justify-between gap-4 text-sm"><span className="text-slate-300">{item.name} <strong className="text-slate-500">x{item.quantity}</strong></span><span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-6 flex justify-between border-t border-white/15 pt-5 text-lg font-black"><span>Total</span><span>${getCartTotal(cart).toFixed(2)}</span></div></aside>
                </div>
            </main>
        </div>
    );
}
