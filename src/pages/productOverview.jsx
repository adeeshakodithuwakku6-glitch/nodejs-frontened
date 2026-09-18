import { FaArrowLeft, FaCartPlus, FaMinus, FaPlus } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import Header from "../components/header";
import { addToCart } from "../lib/cart";
import { getAuth } from "../lib/auth";

export default function ProductOverview() {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const auth = getAuth();

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

    const loadComments = useCallback(async () => {
        setIsCommentsLoading(true);
        try {
            const response = await api.get(`/products/${encodeURIComponent(productID)}/comments`);
            const loadedComments = response.data?.comments || response.data;
            setComments(Array.isArray(loadedComments) ? loadedComments : []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not load comments.");
        } finally {
            setIsCommentsLoading(false);
        }
    }, [productID]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    async function handleCreateComment(event) {
        event.preventDefault();
        const text = commentText.trim();

        if (!auth) {
            return;
        }
        if (!text) {
            toast.error("Write a comment first.");
            return;
        }

        setIsCommentSubmitting(true);
        try {
            const response = await api.post(`/products/${encodeURIComponent(productID)}/comments`, { text });
            setCommentText("");
            await loadComments();
            toast.success("Comment added.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not add comment.");
        } finally {
            setIsCommentSubmitting(false);
        }
    }

    async function handleDeleteComment(commentId) {
        try {
            await api.delete(`/products/${encodeURIComponent(productID)}/comments/${encodeURIComponent(commentId)}`);
            await loadComments();
            toast.success("Comment deleted.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not delete comment.");
        }
    }

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
    const currentUserId = auth?.user?._id || auth?.user?.id || auth?.user?.userId || auth?.user?.userID;

    function commentBelongsToCurrentUser(comment) {
        const owner = comment.user || comment.author || comment.createdBy || {};
        const ownerId = comment.userId || comment.userID || comment.authorId || comment.createdById || owner._id || owner.id || owner.userId || owner.userID;
        return Boolean(currentUserId && ownerId && String(currentUserId) === String(ownerId));
    }

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
                <section className="mt-8 rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70 sm:p-10">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">Community</p>
                            <h2 className="mt-2 text-3xl font-black text-slate-950">Product comments</h2>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">{comments.length} comment{comments.length === 1 ? "" : "s"}</span>
                    </div>
                    {auth ? <form onSubmit={handleCreateComment} className="mt-6 flex flex-col gap-3">
                        <label htmlFor="product-comment" className="sr-only">Write your comment</label>
                        <textarea id="product-comment" value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Write your comment here..." rows="4" className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        <button type="submit" disabled={isCommentSubmitting} className="self-start rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60">{isCommentSubmitting ? "Posting..." : "Post comment"}</button>
                    </form> : <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 font-semibold text-slate-600">Please login to write a comment.</p>}
                    <div className="mt-7 space-y-4">
                        {isCommentsLoading ? <p className="text-slate-500">Loading comments...</p> : comments.length === 0 ? <p className="text-slate-500">No comments yet. Start the conversation.</p> : comments.map((comment) => {
                            const commentId = comment._id || comment.id || comment.commentId;
                            const author = [comment.authorFirstName, comment.authorLastName].filter(Boolean).join(" ") || "Customer";
                            const commentDate = comment.createdAt || comment.created_at || comment.date;
                            return <article key={commentId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-bold text-slate-950">{author}</p><p className="mt-2 whitespace-pre-wrap text-slate-700">{comment.text || comment.comment}</p><p className="mt-3 text-sm text-slate-500">{commentDate ? new Date(commentDate).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "Date unavailable"}</p></div>{commentBelongsToCurrentUser(comment) && <button type="button" onClick={() => handleDeleteComment(commentId)} className="shrink-0 text-sm font-semibold text-red-600 hover:text-red-800">Delete</button>}</div></article>;
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
