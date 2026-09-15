import { FaCartShopping, FaHouse, FaRightToBracket, FaUserPlus } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCart, getCartItemCount } from "../lib/cart";

const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-semibold transition ${
        isActive
            ? "border-amber-400 text-slate-950"
            : "border-transparent text-slate-600 hover:border-sky-500 hover:text-slate-950"
    }`;

export default function Header() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => setCartCount(getCartItemCount());
        updateCartCount();
        window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
        window.addEventListener("storage", updateCartCount);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
                <Link to="/" className="flex shrink-0 items-center gap-3">
                    <img src="/logologin.png" alt="Store logo" className="h-10 w-14 rounded-lg object-cover" />
                    <span className="text-xl font-black tracking-tight text-slate-900">TechNest</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
                    <NavLink to="/" className={navLinkClass}>
                        <FaHouse />
                        Home
                    </NavLink>
                    <NavLink to="/login" className={navLinkClass}>
                        <FaRightToBracket />
                        Login
                    </NavLink>
                    <NavLink to="/register" className={navLinkClass}>
                        <FaUserPlus />
                        Register
                    </NavLink>
                    <NavLink to="/cart" className={navLinkClass}>
                        <FaCartShopping />
                        Cart {cartCount > 0 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-950">{cartCount}</span>}
                    </NavLink>
                </nav>

                <Link to="/cart" aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-sky-600 md:hidden">
                    <FaCartShopping />
                    {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-950">{cartCount}</span>}
                </Link>
            </div>
        </header>
    );
}
