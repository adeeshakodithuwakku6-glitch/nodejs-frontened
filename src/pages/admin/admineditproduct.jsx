import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import uploadMedia from "../../lib/uploadMedia";
import api from "../../lib/api";
import LoadingAnimation from "../../components/loadinganimation";

export default function EditProduct() {
    const { productID } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        productID: "",
        name: "",
        altNames: [],
        description: "",
        images: [],
        price: "",
        labelledPrice: "",
        stock: "",
        isAvailable: true,
        category: "",
        brand: "",
        model: "",
    });
    const [newImages, setNewImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadProduct() {
            if (!productID) {
                toast.error("Product ID is missing.");
                navigate("/admin/products");
                return;
            }

            try {
                const response = await api.get(`/products/${encodeURIComponent(productID)}`);
                const loadedProduct = response.data?.product || response.data;

                if (!loadedProduct?.productID) {
                    throw new Error("Product was not found.");
                }

                setProduct(loadedProduct);
                setFormData({
                    productID: loadedProduct.productID || "",
                    name: loadedProduct.name || "",
                    altNames: loadedProduct.altNames || [],
                    description: loadedProduct.description || "",
                    images: loadedProduct.images || [],
                    price: loadedProduct.price ?? "",
                    labelledPrice: loadedProduct.labelledPrice ?? "",
                    stock: loadedProduct.stock ?? "",
                    isAvailable: loadedProduct.isAvailable ?? true,
                    category: loadedProduct.category || "",
                    brand: loadedProduct.brand || "",
                    model: loadedProduct.model || "",
                });
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load product.");
                navigate("/admin/products");
            } finally {
                setIsLoading(false);
            }
        }

        loadProduct();
    }, [navigate, productID]);

    function updateField(event) {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    }

    async function handleUpdate(event) {
        event.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You are not logged in.");
            navigate("/login");
            return;
        }

        setIsSaving(true);

        try {
            const imageUrls = newImages.length > 0
                ? await Promise.all(newImages.map((image) => uploadMedia(image)))
                : formData.images;
            const payload = {
                ...formData,
                price: Number(formData.price),
                labelledPrice: Number(formData.labelledPrice),
                stock: Number(formData.stock),
                altNames: Array.isArray(formData.altNames) ? formData.altNames : [],
                images: imageUrls,
            };
            const response = await api.put(`/products/${encodeURIComponent(productID)}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(response.data?.message || "Product updated successfully.");
            navigate("/admin/products");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <LoadingAnimation />;
    }

    if (!product) {
        return null;
    }

    return (
        <div className="relative min-h-full p-4">
            {isSaving && <LoadingAnimation />}
            <form onSubmit={handleUpdate} className="rounded-lg bg-white px-4 py-5 shadow-md">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-semibold text-black">Edit Product</h1>
                    <div className="flex items-center gap-2">
                        <Link to="/admin/products" className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
                            Cancel
                        </Link>
                        <button type="submit" disabled={isSaving} className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Product ID
                        <input name="productID" value={formData.productID} onChange={updateField} required className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Name
                        <input name="name" value={formData.name} onChange={updateField} required className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Alt Names
                        <input value={formData.altNames.join(", ")} onChange={(event) => setFormData((currentData) => ({ ...currentData, altNames: event.target.value.split(",").map((name) => name.trim()) }))} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Description
                        <textarea name="description" value={formData.description} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Replace Images
                        <input type="file" multiple onChange={(event) => setNewImages(Array.from(event.target.files || []))} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Price
                        <input name="price" type="number" value={formData.price} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Labelled Price
                        <input name="labelledPrice" type="number" value={formData.labelledPrice} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Stock
                        <input name="stock" type="number" value={formData.stock} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Availability
                        <select name="isAvailable" value={String(formData.isAvailable)} onChange={(event) => setFormData((currentData) => ({ ...currentData, isAvailable: event.target.value === "true" }))} className="rounded-md border border-gray-300 px-4 py-2">
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Category
                        <select name="category" value={formData.category} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2">
                            <option value="">Select a category</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Keyboard">Keyboard</option>
                            <option value="Mouse">Mouse</option>
                            <option value="Printer">Printer</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Brand
                        <input name="brand" value={formData.brand} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        Model
                        <input name="model" value={formData.model} onChange={updateField} className="rounded-md border border-gray-300 px-4 py-2" />
                    </label>
                </div>
            </form>
        </div>
    );
}
