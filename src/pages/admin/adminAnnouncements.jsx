import { useEffect, useState } from "react";
import { FaBullhorn, FaRegTrashCan } from "react-icons/fa6";
import toast from "react-hot-toast";
import api from "../../lib/api";
import uploadMedia from "../../lib/uploadMedia";

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    async function loadAnnouncements() {
        try {
            const response = await api.get("/announcements");
            const data = Array.isArray(response.data) ? response.data : response.data?.announcements || [];
            setAnnouncements(data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not load announcements.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadAnnouncements();
    }, []);

    async function handleCreate(event) {
        event.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error("Enter an announcement title and message.");
            return;
        }
        setIsSaving(true);
        try {
            const imageUrl = imageFile ? await uploadMedia(imageFile) : "";
            const response = await api.post("/announcements", {
                title: title.trim(),
                message: message.trim(),
                ...(imageUrl ? { image: imageUrl } : {}),
            });
            const created = response.data?.announcement || response.data;
            if (created?._id || created?.id) {
                setAnnouncements((current) => [created, ...current]);
            } else {
                await loadAnnouncements();
            }
            setTitle("");
            setMessage("");
            setImageFile(null);
            setImagePreview("");
            toast.success("Announcement published.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not publish announcement.");
        } finally {
            setIsSaving(false);
        }
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0] || null;
        if (!file) {
            setImageFile(null);
            setImagePreview("");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            event.target.value = "";
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function handleDelete(announcementId) {
        try {
            await api.delete(`/announcements/${encodeURIComponent(announcementId)}`);
            setAnnouncements((current) => current.filter((announcement) => (announcement._id || announcement.id) !== announcementId));
            toast.success("Announcement deleted for everyone.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not delete announcement.");
        }
    }

    return (
        <div className="min-h-full bg-[radial-gradient(circle_at_top,#123b58_0%,#06111f_48%,#040a14_100%)] p-5 text-white sm:p-8 lg:p-12">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-xl text-slate-950"><FaBullhorn /></span>
                    <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Storefront communication</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Announcements</h1><p className="mt-2 max-w-2xl text-slate-400">Publish updates that customers can dismiss on their own devices.</p></div>
                </div>

                <form onSubmit={handleCreate} className="mt-8 rounded-3xl border border-cyan-900/70 bg-slate-900/80 p-5 shadow-xl shadow-cyan-950/20 sm:p-7">
                    <h2 className="text-xl font-black">Create announcement</h2>
                    <div className="mt-5 grid gap-4">
                        <label className="text-sm font-bold text-slate-300">Title<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="New promotion" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-white outline-none focus:border-cyan-400" /></label>
                        <label className="text-sm font-bold text-slate-300">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} rows="4" placeholder="Get 20% off all products this week." className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-white outline-none focus:border-cyan-400" /></label>
                        <label className="text-sm font-bold text-slate-300">Announcement image <span className="font-normal text-slate-500">(optional)</span><input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 w-full rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 font-normal text-slate-300 outline-none focus:border-cyan-400" />{imagePreview && <img src={imagePreview} alt="Announcement preview" className="mt-3 max-h-48 w-full rounded-xl object-cover" />}</label>
                        <button type="submit" disabled={isSaving} className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit">{isSaving ? "Publishing..." : "Publish announcement"}</button>
                    </div>
                </form>

                <section className="mt-8">
                    <h2 className="text-xl font-black">Published announcements</h2>
                    {isLoading ? <p className="mt-5 text-slate-400">Loading announcements...</p> : announcements.length === 0 ? <p className="mt-5 rounded-2xl border border-cyan-900/70 bg-slate-900/60 p-6 text-slate-400">No announcements published.</p> : <div className="mt-5 space-y-4">{announcements.map((announcement) => { const announcementId = announcement._id || announcement.id; return <article key={announcementId} className="flex flex-col gap-4 rounded-2xl border border-cyan-900/70 bg-slate-900/80 p-5 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0">{announcement.image && <img src={announcement.image} alt={announcement.title || "Announcement"} className="mb-4 max-h-48 w-full rounded-xl object-cover" />}<h3 className="text-lg font-black text-white">{announcement.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{announcement.message}</p></div><button type="button" onClick={() => handleDelete(announcementId)} aria-label={`Delete ${announcement.title}`} title="Delete announcement" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/40 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400 hover:text-slate-950"><FaRegTrashCan />Delete</button></article>; })}</div>}
                </section>
            </div>
        </div>
    );
}
