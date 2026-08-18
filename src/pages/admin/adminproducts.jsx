import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const query = search.toLowerCase();

        return (
            (product.productID || "").toLowerCase().includes(query) ||
            (product.name || "").toLowerCase().includes(query) ||
            (product.category || "").toLowerCase().includes(query) ||
            (product.brand || "").toLowerCase().includes(query) ||
            (product.model || "").toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#f8fbff,#eef4ff_35%,#e7eefb_100%)] p-6 text-slate-700">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white/80 p-5 shadow-lg shadow-blue-100 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Inventory</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin Products</h1>
                    </div>

                    <div className="w-full max-w-md">
                        <label htmlFor="product-search" className="sr-only">Search products</label>
                        <div className="relative">
                            <input
                                id="product-search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by ID, name, category..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-inner outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />
                            <svg
                                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/80">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead>
                                <tr className="bg-slate-900 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Brand</th>
                                    <th className="px-4 py-3">Model</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => {
                                    const imageUrl = product.images?.[0] || "https://placehold.co/80x80/e2e8f0/475569?text=No+Image";

                                    return (
                                        <tr
                                            key={product._id ?? product.id ?? product.productID}
                                            className={`${
                                                index % 2 === 0 ? "bg-slate-50" : "bg-white"
                                            } transition-colors duration-200 hover:bg-sky-50`}
                                        >
                                            <td className="px-4 py-3">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name || "Product image"}
                                                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-200 shadow-sm"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-800">{product.productID || "-"}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-800">{product.name || "-"}</td>
                                            <td className="px-4 py-3">{product.category || "-"}</td>
                                            <td className="px-4 py-3">{product.brand || "-"}</td>
                                            <td className="px-4 py-3">{product.model || "-"}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">{Number(product.stock ?? 0)}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        product.isAvailable
                                                            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                                            : "bg-red-100 text-red-700 ring-1 ring-red-200"
                                                    }`}
                                                >
                                                    {product.isAvailable ? "Available" : "Unavailable"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900">
                                                ${Number(product.price ?? 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex items-center justify-center border-t border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
                            No products match your search.
                        </div>
                    )}
                </div>
            </div>

            <Link to="/admin/add-product" className="fixed bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40">
                <FaCirclePlus className="text-3xl" />
            </Link>
        </div>
    );
}