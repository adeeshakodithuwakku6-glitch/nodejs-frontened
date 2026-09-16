import { FaArrowLeft, FaCartPlus, FaMinus, FaPlus } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import Header from "../components/header";
import { addToCart } from "../lib/cart";

export default function ProductOverview() {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function loadProduct() {
            try {
                const response = await api.get(`/products/${encodeURIComponent(productID)}`);
                const loadedProduct = response.data?.product || response.data;

                if (!loadedProduct?.productID) {
                    throw new Error("Product was not found.");
                }

                setProduct(loadedProduct);
            } catch (error) {
                toast.error(error.response?.data?.message || "Could not load product.");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        }

        loadProduct();
    }, [navigate, productID]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="flex min-h-[60vh] items-center justify-center text-slate-500">Loading product...</div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const imageUrl = product.images?.[0] || "https://placehold.co/900x700/e2e8f0/475569?text=No+Image";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-sky-600">
                    <FaArrowLeft />
                    Back to products
                </Link>
                <section className="grid overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[1.1fr_1fr]">
                    <div className="flex items-center justify-center bg-slate-100 p-8" style={{ minHeight: "360px" }}>
                        <img src={imageUrl} alt={product.name || "Product image"} className="w-full object-contain" style={{ maxHeight: "540px" }} />
                    </div>
                    <div className="flex flex-col justify-center p-7 sm:p-12">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">{product.category || "Product"}</p>
                        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{product.name}</h1>
                        <p className="mt-4 text-3xl font-black text-slate-900">${Number(product.price ?? 0).toFixed(2)}</p>
                        <p className="mt-6 leading-7 text-slate-600">{product.description || "A carefully selected product from our technology collection."}</p>
                        <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-slate-200 py-6 text-sm">
                            <div><dt className="text-slate-500">Brand</dt><dd className="mt-1 font-bold text-slate-900">{product.brand || "-"}</dd></div>
                            <div><dt className="text-slate-500">Model</dt><dd className="mt-1 font-bold text-slate-900">{product.model || "-"}</dd></div>
                            <div><dt className="text-slate-500">Availability</dt><dd className="mt-1 font-bold text-emerald-600">{product.isAvailable ? "In stock" : "Unavailable"}</dd></div>
                            <div><dt className="text-slate-500">Stock</dt><dd className="mt-1 font-bold text-slate-900">{Number(product.stock ?? 0)} units</dd></div>
                        </dl>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <div className="flex h-14 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 sm:w-36">
                                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-950"><FaMinus /></button>
                                <span className="font-black text-slate-950">{quantity}</span>
                                <button type="button" onClick={() => setQuantity((current) => Math.min(Number(product.stock ?? 1), current + 1))} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-950"><FaPlus /></button>
                            </div>
                            <button type="button" disabled={!product.isAvailable || Number(product.stock ?? 0) < 1} onClick={() => { addToCart(product, quantity); toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart.`); }} className="inline-flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300">
                                <FaCartPlus />
                                {product.isAvailable && Number(product.stock ?? 0) > 0 ? "Add to cart" : "Out of stock"}
                            </button>
                            <button type="button" disabled={!product.isAvailable || Number(product.stock ?? 0) < 1} onClick={() => { addToCart(product, quantity); navigate("/cart"); }} className="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300">Buy now</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
