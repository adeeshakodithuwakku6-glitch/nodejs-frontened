import { FaXmark } from "react-icons/fa6";

export default function DeleteProductModal({ product, isDeleting, onClose, onConfirm }) {
    if (!product) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-product-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="delete-product-title" className="text-xl font-bold text-slate-900">
                            Delete product?
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Are you sure you want to delete {product.name || "this product"}? This action cannot be undone.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label="Close delete dialog"
                        className="text-xl text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
                    >
                        <FaXmark />
                    </button>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
