import { FaArrowLeft, FaMinus, FaPlus, FaRegTrashCan, FaCartShopping, FaShieldHalved, FaTruckFast, FaCreditCard, FaMoneyBillWave } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/header";
import { CART_UPDATED_EVENT, clearCart, getCart, getCartTotal, removeFromCart, updateCartQuantity } from "../lib/cart";
import { getAuth } from "../lib/auth";
import { INVOICE_STORAGE_KEY } from "./invoicePage";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });

    useEffect(() => {
        const loadCart = () => setCart(getCart());
        loadCart();
        window.addEventListener(CART_UPDATED_EVENT, loadCart);
        window.addEventListener("storage", loadCart);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, loadCart);
            window.removeEventListener("storage", loadCart);
        };
    }, []);

    const changeQuantity = (item, quantity) => {
        const nextQuantity = Math.max(0, Math.min(quantity, item.stock || quantity));
        setCart(updateCartQuantity(item.productID, nextQuantity));
    };

    const handleRemove = (productID) => {
        setCart(removeFromCart(productID));
        toast.success("Product removed from cart.");
    };

    const handleClear = () => {
        setCart(clearCart());
        toast.success("Cart cleared.");
    };

    const subtotal = getCartTotal(cart);

    const placeOrder = (event) => {
        event.preventDefault();
        if (!getAuth()) {
            toast.error("Please log in before placing an order.");
            return;
        }
        const invoice = { invoiceNumber: `TN-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), customer, items: cart, total: subtotal };
        localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoice));
        clearCart();
        toast.success("Order placed. Your invoice is ready.");
        window.location.assign("/invoice");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
                <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Your selection</p><h1 className="mt-2 text-4xl font-black text-slate-950">Shopping cart</h1></div>
                    <div className="flex items-center gap-5"><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600"><FaArrowLeft /> Continue shopping</Link>{cart.length > 0 && <button type="button" onClick={handleClear} className="text-sm font-bold text-red-600 hover:text-red-800">Clear cart</button>}</div>
                </div>

                {cart.length === 0 ? (
                    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                        <FaCartShopping className="text-5xl text-sky-500" />
                        <h2 className="mt-5 text-3xl font-black text-slate-950">Your cart is empty</h2>
                        <p className="mt-3 text-slate-500">Add products from the home page to see them here.</p>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm text-sky-900"><FaTruckFast className="text-xl text-sky-600" /><span><strong>Free delivery</strong> on qualifying orders.</span></div>
                            {cart.map((item) => (
                                <article key={item.productID} className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                                    <img src={item.image} alt={item.name} className="h-28 w-full rounded-xl bg-slate-100 object-contain sm:w-36" />
                                    <div className="min-w-0 flex-1"><h2 className="truncate text-lg font-bold text-slate-950">{item.name}</h2><p className="mt-1 text-sm text-slate-500">${item.price.toFixed(2)} each</p></div>
                                    <div className="flex items-center gap-3"><button type="button" onClick={() => changeQuantity(item, item.quantity - 1)} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200"><FaMinus /></button><span className="w-6 text-center font-bold">{item.quantity}</span><button type="button" disabled={item.stock > 0 && item.quantity >= item.stock} onClick={() => changeQuantity(item, item.quantity + 1)} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"><FaPlus /></button></div>
                                    <p className="w-24 text-right text-lg font-black text-slate-950">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button type="button" onClick={() => handleRemove(item.productID)} aria-label={`Remove ${item.name}`} className="text-red-500 hover:text-red-700"><FaRegTrashCan /></button>
                                </article>
                            ))}
                        </div>
                        <aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white shadow-xl"><h2 className="text-xl font-bold">Order summary</h2><div className="mt-6 flex justify-between border-b border-white/15 pb-4 text-slate-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="mt-4 flex justify-between text-lg font-black"><span>Total</span><span>${subtotal.toFixed(2)}</span></div><button type="button" onClick={() => setCheckoutOpen(true)} className="mt-7 w-full rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300">Buy now</button><p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><FaShieldHalved /> Secure checkout experience</p></aside>
                    </div>
                )}
                {checkoutOpen && <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 p-5"><form onSubmit={placeOrder} className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Checkout</p><h2 className="mt-1 text-2xl font-black text-slate-950">Choose how to pay</h2></div><button type="button" onClick={() => setCheckoutOpen(false)} className="text-2xl text-slate-400 hover:text-slate-900" aria-label="Close checkout">&times;</button></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4"><FaMoneyBillWave className="text-xl text-amber-600" /><p className="mt-2 font-bold text-slate-950">Cash on delivery</p><p className="text-xs text-slate-600">Available now</p></div><div className="rounded-2xl border border-slate-200 p-4 opacity-50"><FaCreditCard className="text-xl text-slate-500" /><p className="mt-2 font-bold text-slate-950">Card payment</p><p className="text-xs text-slate-600">Coming soon</p></div></div><div className="mt-6 space-y-3"><input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /><input required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Phone number" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /><textarea required value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} placeholder="Delivery address" rows="3" className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500" /></div><button type="submit" className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-4 font-black text-white hover:bg-sky-600">Place order and view invoice</button></form></div>}
            </main>
        </div>
    );
}
