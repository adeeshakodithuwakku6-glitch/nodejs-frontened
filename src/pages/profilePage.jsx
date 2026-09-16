import { FaArrowLeft, FaCamera, FaEye, FaFileInvoiceDollar, FaPen, FaTruckFast, FaUser } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../components/header";
import api from "../lib/api";
import uploadMedia from "../lib/uploadMedia";
import { getAuth, saveAuth } from "../lib/auth";
import { getStoredOrders, saveOrderForUser } from "../lib/orders";

const emptyProfile = {
    email: "",
    firstName: "",
    lastName: "",
    image: "",
    isVerified: false,
    isActive: true,
};

function getProfileData(data) {
    return data?.user || data?.profile || data?.account || data?.data?.user || data?.data || data;
}

function normalizeProfile(data, fallback = {}) {
    const profile = getProfileData(data) || {};
    return {
        email: profile.email || fallback.email || "",
        firstName: profile.firstName || profile.firstname || fallback.firstName || "",
        lastName: profile.lastName || profile.lastname || fallback.lastName || "",
        image: profile.image || profile.profileImage || profile.profile_image || fallback.image || "",
        isVerified: Boolean(profile.isVerified ?? profile.verified ?? profile.emailVerified ?? fallback.isVerified),
        isActive: profile.isActive ?? profile.active ?? (profile.accountStatus ? profile.accountStatus !== "Suspended" : fallback.isActive),
    };
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [profile, setProfile] = useState(() => normalizeProfile(auth?.user, auth?.user));
    const [form, setForm] = useState(profile);
    const [isLoading, setIsLoading] = useState(Boolean(auth));
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [orders, setOrders] = useState(() => getStoredOrders(auth?.user?.email));
    const [ordersLoading, setOrdersLoading] = useState(Boolean(auth));

    useEffect(() => {
        if (!auth) {
            return undefined;
        }

        let isMounted = true;
        async function loadProfile() {
            try {
                const response = await api.get("/users/profile");
                const nextProfile = normalizeProfile(response.data, auth.user);
                if (isMounted) {
                    setProfile(nextProfile);
                    setForm(nextProfile);
                    saveAuth({ ...auth, user: nextProfile });
                }
            } catch (error) {
                if (isMounted && error.response?.status !== 401) {
                    setErrorMessage(error.response?.data?.message || "Could not load your profile.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProfile();
        async function loadOrders() {
            try {
                const response = await api.get("/orders");
                const serverOrders = response.data?.orders || response.data;
                if (Array.isArray(serverOrders)) {
                    serverOrders.forEach((order) => saveOrderForUser(auth.user?.email, order));
                    setOrders(serverOrders);
                }
            } catch (error) {
                if (error.response?.status !== 404) console.error("Could not load orders:", error);
            } finally {
                setOrdersLoading(false);
            }
        }
        loadOrders();
        return () => {
            isMounted = false;
        };
    }, [auth?.token]);

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    const updateField = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrorMessage("Please select an image file.");
            return;
        }
        setSelectedImage(file);
        setForm((current) => ({ ...current, image: URL.createObjectURL(file) }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!form.firstName.trim() || !form.lastName.trim()) {
            setErrorMessage("First name and last name are required.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");
        try {
            let image = form.image.trim();
            if (selectedImage) {
                image = await uploadMedia(selectedImage);
            }
            const response = await api.patch("/users/profile", {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                image,
            });
            const nextProfile = normalizeProfile(response.data, { ...profile, ...form, image });
            setProfile(nextProfile);
            setForm(nextProfile);
            setSelectedImage(null);
            saveAuth({ ...auth, user: nextProfile });
            setIsEditing(false);
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("Could not save profile:", error);
            setErrorMessage(error.response?.data?.message || "Could not save your profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const cancelEditing = () => {
        setForm(profile);
        setSelectedImage(null);
        setErrorMessage("");
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-[#06111f] text-white"><Header /><main className="flex min-h-[65vh] items-center justify-center text-slate-300">Loading profile...</main></div>;
    }

    return (
        <div className="min-h-screen bg-[#06111f] text-slate-100">
            <Header />
            <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-cyan-300"><FaArrowLeft /> Back to store</Link>
                <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-900/70 bg-slate-900 shadow-2xl shadow-cyan-950/30">
                    <div className="border-b border-cyan-900/70 bg-[radial-gradient(circle_at_top_right,#164e63,#0f172a_60%)] p-7 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Account</p><h1 className="mt-2 text-3xl font-black text-white">Your profile</h1><p className="mt-2 text-slate-300">Manage your account information.</p></div>
                    {errorMessage && <div role="alert" className="mx-7 mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200 sm:mx-10">{errorMessage}</div>}
                    {!isEditing ? <div className="grid gap-8 p-7 sm:grid-cols-[180px_1fr] sm:p-10"><div className="flex flex-col items-center gap-3"><div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-cyan-300/70 bg-slate-950 text-5xl text-cyan-300">{profile.image ? <img src={profile.image} alt="Profile" className="h-full w-full object-cover" /> : <FaUser />}</div><span className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile image</span></div><div className="grid content-start gap-5 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</p><p className="mt-2 break-all font-bold text-white">{profile.email || "Not provided"}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Verification</p><p className={`mt-2 font-bold ${profile.isVerified ? "text-emerald-300" : "text-amber-300"}`}>{profile.isVerified ? "Verified" : "Not verified"}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">First name</p><p className="mt-2 font-bold text-white">{profile.firstName || "Not provided"}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Last name</p><p className="mt-2 font-bold text-white">{profile.lastName || "Not provided"}</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Account status</p><p className={`mt-2 font-bold ${profile.isActive ? "text-emerald-300" : "text-red-300"}`}>{profile.isActive ? "Active" : "Inactive"}</p></div><div className="sm:col-span-2"><button type="button" onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 hover:bg-white"><FaPen /> Edit profile</button></div></div></div> : <form onSubmit={handleSave} className="grid gap-6 p-7 sm:grid-cols-[180px_1fr] sm:p-10"><div className="flex flex-col items-center gap-3"><div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-cyan-300/70 bg-slate-950 text-5xl text-cyan-300">{form.image ? <img src={form.image} alt="Profile preview" className="h-full w-full object-cover" /> : <FaUser />}</div><label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-cyan-300 hover:text-white"><FaCamera /> Change image<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-slate-300">Email<input value={form.email} readOnly className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-500" /></label><div /><label className="text-sm font-bold text-slate-300">First name<input name="firstName" value={form.firstName} onChange={updateField} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" /></label><label className="text-sm font-bold text-slate-300">Last name<input name="lastName" value={form.lastName} onChange={updateField} required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" /></label><label className="text-sm font-bold text-slate-300 sm:col-span-2">Profile image URL<input name="image" value={form.image} onChange={updateField} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400" /></label><div className="flex flex-wrap gap-3 sm:col-span-2"><button type="submit" disabled={isSaving} className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : "Save changes"}</button><button type="button" onClick={cancelEditing} disabled={isSaving} className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-200 hover:border-white disabled:opacity-60">Cancel</button></div></div></form>}
                    <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-900/70 bg-slate-900 shadow-2xl shadow-cyan-950/30">
                        <div className="border-b border-cyan-900/70 p-7 sm:p-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Order history</p><h2 className="mt-2 text-2xl font-black text-white">Your orders</h2><p className="mt-2 text-slate-400">Track deliveries and download bills for your orders.</p></div>
                        {ordersLoading ? <p className="p-7 text-slate-400">Loading orders...</p> : orders.length === 0 ? <p className="p-7 text-slate-400">No orders found yet.</p> : <div className="divide-y divide-cyan-900/50">{orders.map((order) => <div key={order.orderId} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-white">{order.orderId}</p><p className="mt-1 text-sm text-slate-400">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable"}</p><p className="mt-2 font-bold text-cyan-300">${Number(order.total || 0).toFixed(2)} <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">{order.status || "Pending"}</span></p></div><div className="flex flex-wrap gap-2"><Link to={`/orders/${encodeURIComponent(order.orderId)}`} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-white"><FaTruckFast /> Track</Link><Link to={`/orders/${encodeURIComponent(order.orderId)}/bill`} className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-300"><FaFileInvoiceDollar /> Bill</Link><Link to={`/orders/${encodeURIComponent(order.orderId)}`} aria-label={`View ${order.orderId}`} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"><FaEye /></Link></div></div>)}</div>}
                    </section>
                </section>
            </main>
        </div>
    );
}
