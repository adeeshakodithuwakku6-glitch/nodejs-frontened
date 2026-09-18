import { FaBars, FaCartShopping, FaHouse, FaLocationDot, FaRightFromBracket, FaRightToBracket, FaUser, FaUserPlus, FaXmark } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import techNestLogo from "../assets/Tech Nest logo.jfif";
import { CART_UPDATED_EVENT, getCart, getCartItemCount } from "../lib/cart";
import { AUTH_UPDATED_EVENT, clearAuth, getAuth, getUserInitial } from "../lib/auth";

const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-semibold transition ${
        isActive
            ? "border-cyan-300 text-white"
            : "border-transparent text-slate-300 hover:border-cyan-400 hover:text-white"
    }`;

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [auth, setAuth] = useState(getAuth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userInitial = getUserInitial(auth?.user);

    useEffect(() => {
        const updateCartCount = () => setCartCount(getAuth() ? getCartItemCount() : 0);
        updateCartCount();
        window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
        window.addEventListener("storage", updateCartCount);

        const updateAuth = () => setAuth(getAuth());
        window.addEventListener(AUTH_UPDATED_EVENT, updateAuth);
        window.addEventListener(AUTH_UPDATED_EVENT, updateCartCount);
        window.addEventListener("storage", updateAuth);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener(AUTH_UPDATED_EVENT, updateAuth);
            window.removeEventListener(AUTH_UPDATED_EVENT, updateCartCount);
            window.removeEventListener("storage", updateAuth);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 border-b border-cyan-900/80 bg-[#071522]/95 shadow-lg shadow-cyan-950/30 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-5 sm:py-4 lg:px-8">
                <Link to="/" className="flex shrink-0 items-center gap-3">
                    <img src={techNestLogo} alt="TechNest logo" className="h-10 w-14 rounded-lg object-cover" />
                    <span className="text-lg font-black tracking-tight text-white sm:text-xl">TechNest</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
                    <NavLink to="/" className={navLinkClass}>
                        <FaHouse />
                        Home
                    </NavLink>
                    {auth ? <div className="flex items-center gap-2"><Link to="/profile" className="flex items-center gap-2 rounded-2xl border border-cyan-800/80 bg-slate-900/80 p-1.5 pl-2.5 shadow-inner shadow-cyan-950/40 transition hover:border-cyan-400" title="Open profile"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-black uppercase text-slate-950">{userInitial}</span><span className="max-w-44 truncate px-1 text-sm font-bold text-white">{auth.user?.email || "Signed in"}</span><span className="hidden text-xs font-bold text-cyan-300 lg:inline"><FaUser /></span></Link><button type="button" onClick={clearAuth} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-red-400/15 hover:text-red-300" aria-label="Log out" title="Log out"><FaRightFromBracket /></button></div> : <><NavLink to="/login" className={navLinkClass}><FaRightToBracket />Login</NavLink><NavLink to="/register" className={navLinkClass}><FaUserPlus />Register</NavLink></>}
                    <NavLink to="/cart" className={navLinkClass}>
                        <FaCartShopping />
                        Cart {cartCount > 0 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-950">{cartCount}</span>}
                    </NavLink>
                    {auth && <NavLink to="/track-order" className={navLinkClass}>
                        <FaLocationDot />
                        Track order
                    </NavLink>}
                    {auth?.isAdmin && <NavLink to="/admin" className={navLinkClass}>
                        <FaUser />
                        Admin panel
                    </NavLink>}
                </nav>

                <div className="flex items-center gap-1.5 md:hidden">
                    {auth && <Link to="/profile" aria-label="Open profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/70 bg-cyan-300 text-sm font-black text-slate-950 transition hover:bg-white">{userInitial}</Link>}
                    {auth?.isAdmin && <Link to="/admin" aria-label="Open admin panel" className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/70 bg-slate-900 text-amber-300 transition hover:bg-amber-400 hover:text-slate-950"><FaUser /></Link>}
                    {auth && <Link to="/track-order" aria-label="Track order" className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/70 bg-slate-900 text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"><FaLocationDot /></Link>}
                    <Link to="/cart" aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-white">
                        <FaCartShopping />
                        {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-950">{cartCount}</span>}
                    </Link>
                    <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/70 text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950">
                        {isMobileMenuOpen ? <FaXmark /> : <FaBars />}
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && <nav id="mobile-navigation" className="border-t border-cyan-900/70 bg-[#071522] px-4 py-3 md:hidden" aria-label="Mobile navigation">
                <div className="mx-auto grid max-w-7xl gap-1">
                    <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaHouse />Home</NavLink>
                    {!auth && <><NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaRightToBracket />Login</NavLink><NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaUserPlus />Register</NavLink></>}
                    {auth && <><NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaUser />Profile</NavLink><NavLink to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaLocationDot />Track order</NavLink></>}
                    {auth?.isAdmin && <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaUser />Admin panel</NavLink>}
                    <NavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}><FaCartShopping />Cart {cartCount > 0 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-950">{cartCount}</span>}</NavLink>
                    {auth && <button type="button" onClick={() => { clearAuth(); setIsMobileMenuOpen(false); }} className="inline-flex items-center gap-2 border-b-2 border-transparent px-1 py-2 text-left text-sm font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300"><FaRightFromBracket />Log out</button>}
                </div>
            </nav>}
        </header>
    );
}
