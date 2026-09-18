import { FaArrowRight, FaCartPlus, FaMagnifyingGlass } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import Header from "../components/header";
import { addToCart } from "../lib/cart";
import { getAuth } from "../lib/auth";
import Footer from "../components/footer.jsx";

export default function Homepage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const auth = getAuth();

    const handleAddToCart = (event, product) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart(product);
        toast.success(`${product.name || "Product"} added to cart.`);
    };

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await api.get("/products");
                const productList = Array.isArray(response.data) ? response.data : response.data?.products;
                setProducts(productList || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error(error.response?.data?.message || "Could not load products.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const query = search.toLowerCase().trim();
        return products.filter((product) => [product.name, product.category, product.brand, product.model]
            .some((field) => (field || "").toLowerCase().includes(query)));
    }, [products, search]);

    return (
        <div className="min-h-screen bg-[#06111f] text-slate-100">
            <Header />
            <main>
                <section className="relative isolate min-h-[68vh] overflow-hidden bg-slate-950 text-white">
                    <img src="/bg.jpg" alt="Colorful laptop ready for a new setup" className="homepage-hero-image absolute inset-0 -z-20 h-full w-full object-cover object-center" />
                    <div className="absolute inset-0 -z-10 bg-slate-950/65" />
                    <div className="mx-auto flex min-h-[68vh] max-w-7xl items-end px-5 py-16 lg:px-8 lg:py-24">
                        <div className="max-w-3xl">
                            <p className="homepage-reveal text-sm font-black uppercase tracking-[0.28em] text-cyan-300">The smart tech collection</p>
                            <h1 className="homepage-reveal homepage-reveal-delay-1 mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">Build a better setup.</h1>
                            <p className="homepage-reveal homepage-reveal-delay-2 mt-6 max-w-xl text-lg leading-8 text-slate-200">{auth ? `Welcome back, ${auth.user?.firstName || auth.user?.firstname || auth.user?.email || "tech explorer"}. Discover dependable gear selected for the way you work and play.` : "Discover dependable laptops, peripherals, and workspace essentials selected for the way you work and play."}</p>
                            <div className="homepage-reveal homepage-reveal-delay-3 mt-8 flex flex-wrap items-center gap-4">
                                <a href="#products" className="inline-flex items-center gap-3 rounded-xl bg-amber-400 px-6 py-4 font-black text-slate-950 transition hover:bg-white">
                                    Shop products <FaArrowRight />
                                </a>
                                <span className="border-l border-white/40 pl-4 text-sm font-semibold text-slate-200">Tools for focused work<br />and vivid ideas.</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="products" className="bg-[radial-gradient(circle_at_top_right,#123b58_0%,#06111f_48%,#040a14_100%)] px-5 py-14 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                    <div className="homepage-reveal flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">In the store</p><h2 className="mt-2 text-3xl font-black text-white">Explore products</h2></div>
                        <label className="relative w-full sm:max-w-xs"><span className="sr-only">Search products</span><FaMagnifyingGlass className="absolute left-4 top-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded-xl border border-cyan-900 bg-slate-900/80 py-3 pl-11 pr-4 text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-900" /></label>
                    </div>

                    {isLoading ? <div className="py-20 text-center text-slate-400">Loading products...</div> : filteredProducts.length === 0 ? <div className="py-20 text-center text-slate-400">No products found.</div> : <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredProducts.map((product) => <Link key={product._id ?? product.id ?? product.productID} to={`/products/${product.productID}`} className="group overflow-hidden rounded-2xl border border-cyan-900/70 bg-slate-900 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-cyan-900/50"><div className="flex aspect-4/3 items-center justify-center bg-slate-800 p-5"><img src={product.images?.[0] || "https://placehold.co/600x450/e2e8f0/475569?text=No+Image"} alt={product.name || "Product image"} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" /></div><div className="p-5"><div className="flex items-start justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{product.category || "Technology"}</p><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${product.isAvailable && Number(product.stock ?? 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-700 text-slate-300"}`}>{product.isAvailable && Number(product.stock ?? 0) > 0 ? "In stock" : "Unavailable"}</span></div><h3 className="mt-2 truncate text-lg font-bold text-white">{product.name || "Unnamed product"}</h3><div className="mt-4 flex items-center justify-between gap-3"><span className="text-xl font-black text-white">${Number(product.price ?? 0).toFixed(2)}</span><button type="button" disabled={!product.isAvailable || Number(product.stock ?? 0) < 1} onClick={(event) => handleAddToCart(event, product)} aria-label={`Add ${product.name || "product"} to cart`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"><FaCartPlus /></button></div><span className="mt-4 block text-sm font-bold text-cyan-300">View details <FaArrowRight className="ml-1 inline transition-transform group-hover:translate-x-1" /></span></div></Link>)}</div>}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
