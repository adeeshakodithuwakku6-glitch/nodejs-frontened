import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import uploadMedia from "../../lib/uploadMedia";
import api from "../../lib/api.js";
import LoadingAnimation from "../../components/loadinganimation";

export default function AddProductsForm() {
    const navigate = useNavigate();
    const[productID, setProductID] = useState("");
    const[name, setName] = useState("");
    const[altNames, setAltNames] = useState([]);
    const[description, setDescription] = useState("");
    const[images, setImages] = useState([]);
    const[price, setPrice] = useState(0);
    const[labelledPrice, setLabelledPrice] = useState("");
    const[stock, setStock] = useState(0);
    const[isAvailable, setIsAvailable] = useState(true);
    const[category, setCategory] = useState("");
    const[brand, setBrand] = useState("");
    const[model, setModel] = useState("");
    const[isSaving, setIsSaving] = useState(false);

    async function handleSave(){
        const token = localStorage.getItem("token");
        if(token == null){
            toast.error("You are not logged in");
            navigate("/login");
            return;
        }
        const productdata ={
            productID : productID,
            name : name,
            altNames : [],
            description : description,
            images : [],
            price : price,
            labelledPrice : labelledPrice,
            stock : stock,
            isAvailable : isAvailable,
            category : category,
            brand : brand,
            model : model
        }
        try{
            setIsSaving(true);
            const imageUploadPromises = [];

            for(let i=0; i<images.length; i++){
                imageUploadPromises[i] = uploadMedia(images[i]);
            }

            console.log(imageUploadPromises);
            const imageUrls = await Promise.all(imageUploadPromises);
            productdata.images = imageUrls;
            productdata.altNames = altNames;

            const resoforders = await api.post("/products", productdata, {
                headers: {
                    Authorization: "Bearer "+token,
                }
            });
            console.log(resoforders);
            toast.success("Product added successfully");
            navigate("/admin/products");

        }catch(err){
            console.log(err);
            toast.error("Failed to add product");
        } finally {
            setIsSaving(false);
        }
    }
    return (
        <div className="relative w-full h-full flex flex-col p-4">
            {isSaving && <LoadingAnimation />}
            <div className="w-full bg-white shadow-md rounded-lg px-4 py-5 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-semibold text-black">Add New Product</h1>
                    <div className="flex items-center gap-2 pr-2">
                        <Link to="/admin/products" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Cancel
                        </Link>
                        <button onClick={handleSave} className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                            Save
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Product ID</label>
                        <input
                            type="text"
                            value={productID}
                            onChange={(e) => setProductID(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Alt Names</label>
                        <input
                            type="text"
                            value={altNames.join(", ")}
                            onChange={(e) => setAltNames(e.target.value.split(",").map((s) => s.trim()))}
                            className="h-12 rounded-md border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="mt-1 text-sm text-gray-500">Enter alternative names separated by commas, e.g. "name1, name2"</span>
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setImages(Array.from(e.target.files))}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Labelled Price</label>
                        <input
                            type="number"
                            value={labelledPrice}
                            onChange={(e) => setLabelledPrice(parseFloat(e.target.value))}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(parseInt(e.target.value))}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Is Available</label>
                        <select
                            value={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.value === "true")}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a category</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Keyboard">Keyboard</option>
                            <option value="Mouse">Mouse</option>
                            <option value="Printer">Printer</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Brand</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Model</label>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
//productID
//name
//altNames[]
//description
//images
//price
//labelledPrice
//stock
//isAvailable
//category
//brand
//model