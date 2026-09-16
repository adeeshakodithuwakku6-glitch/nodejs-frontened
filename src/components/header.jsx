import { FaCartShopping, FaHouse, FaRightFromBracket, FaRightToBracket, FaUserPlus } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { CART_UPDATED_EVENT, getCart, getCartItemCount } from "../lib/cart";
import { AUTH_UPDATED_EVENT, clearAuth, getAuth } from "../lib/auth";

const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-semibold transition ${
        isActive
            ? "border-cyan-300 text-white"
            : "border-transparent text-slate-300 hover:border-cyan-400 hover:text-white"
    }`;

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [auth, setAuth] = useState(getAuth);

    useEffect(() => {
        const updateCartCount = () => setCartCount(getCartItemCount());
        updateCartCount();
        window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
        window.addEventListener("storage", updateCartCount);

        const updateAuth = () => setAuth(getAuth());
        window.addEventListener(AUTH_UPDATED_EVENT, updateAuth);
        window.addEventListener("storage", updateAuth);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener(AUTH_UPDATED_EVENT, updateAuth);
            window.removeEventListener("storage", updateAuth);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 border-b border-cyan-900/80 bg-[#071522]/95 shadow-lg shadow-cyan-950/30 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
                <Link to="/" className="flex shrink-0 items-center gap-3">
                    <img src="/logologin.png" alt="Store logo" className="h-10 w-14 rounded-lg object-cover" />
                    <span className="text-xl font-black tracking-tight text-white">TechNest</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
                    <NavLink to="/" className={navLinkClass}>
                        <FaHouse />
                        Home
                    </NavLink>
                    {auth ? <div className="flex items-center gap-2 rounded-2xl border border-cyan-800/80 bg-slate-900/80 p-1.5 pl-2.5 shadow-inner shadow-cyan-950/40"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-black uppercase text-slate-950">{(auth.user?.email || "S").charAt(0)}</span><span className="max-w-44 truncate px-1 text-sm font-bold text-white" title={auth.user?.email}>{auth.user?.email || "Signed in"}</span><button type="button" onClick={clearAuth} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-red-400/15 hover:text-red-300" aria-label="Log out" title="Log out"><FaRightFromBracket /></button></div> : <><NavLink to="/login" className={navLinkClass}><FaRightToBracket />Login</NavLink><NavLink to="/register" className={navLinkClass}><FaUserPlus />Register</NavLink></>}
                    <NavLink to="/cart" className={navLinkClass}>
                        <FaCartShopping />
                        Cart {cartCount > 0 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-950">{cartCount}</span>}
                    </NavLink>
                </nav>

                <Link to="/cart" aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-white md:hidden">
                    <FaCartShopping />
                    {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-950">{cartCount}</span>}
                </Link>
            </div>
        </header>
    );
}
