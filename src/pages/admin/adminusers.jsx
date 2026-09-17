import { useEffect, useState } from "react";
import { FaCamera, FaCheck, FaEnvelope, FaLock, FaMagnifyingGlass, FaPen, FaUser, FaXmark } from "react-icons/fa6";
import toast from "react-hot-toast";
import api, { resolveMediaUrl } from "../../lib/api";
import uploadMedia from "../../lib/uploadMedia";
import { getDefaultAvatar, isPlaceholderImage } from "../../lib/avatar";

function getUsers(data) {
    if (Array.isArray(data)) return data;
    return data?.users || data?.data?.users || data?.data || [];
}

function normalizeUser(user) {
    return {
        ...user,
        firstName: user.firstName || user.firstname || "",
        lastName: user.lastName || user.lastname || "",
        gender: ["male", "female", "other"].includes(String(user.gender || "").toLowerCase()) ? String(user.gender).toLowerCase() : "other",
        image: (() => {
            const gender = String(user.gender || "").toLowerCase();
            const image = user.image || user.profileImage || user.profile_image || "";
            return isPlaceholderImage(image) ? getDefaultAvatar(gender) : resolveMediaUrl(image);
        })(),
        isadmin: Boolean(user.isadmin ?? user.isAdmin ?? user.admin),
        isblocked: Boolean(user.isblocked ?? user.isBlocked ?? user.blocked),
        isemailverified: Boolean(user.isemailverified ?? user.isEmailVerified ?? user.emailVerified ?? user.verified),
    };
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function loadUsers(value = search) {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await api.get("/users", { params: value.trim() ? { search: value.trim() } : undefined });
            setUsers(getUsers(response.data).map(normalizeUser));
        } catch (error) {
            setUsers([]);
            setErrorMessage(error.response?.status === 403 ? "Access denied. Only administrators can view users." : error.response?.data?.message || "Could not load users.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadUsers("");
    }, []);

    useEffect(() => {
        if (!selectedImage) {
            setImagePreview("");
            return undefined;
        }

        const previewUrl = URL.createObjectURL(selectedImage);
        setImagePreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [selectedImage]);

    const updateUser = (name, value) => setEditingUser((user) => ({ ...user, [name]: value }));

    async function handleSave(event) {
        event.preventDefault();
        if (!editingUser?.email) return;
        setIsSaving(true);
        try {
            let image = editingUser.image;
            if (selectedImage) image = await uploadMedia(selectedImage);
            const response = await api.put(`/users/${encodeURIComponent(editingUser.email)}`, {
                firstName: editingUser.firstName.trim(),
                lastName: editingUser.lastName.trim(),
                gender: editingUser.gender,
                password: editingUser.password?.trim() || undefined,
                image,
            });
            const savedUser = normalizeUser(response.data?.user || response.data || { ...editingUser, image });
            setUsers((current) => current.map((user) => user.email === editingUser.email ? { ...user, ...savedUser } : user));
            setEditingUser(null);
            setSelectedImage(null);
            toast.success("User profile updated.");
        } catch (error) {
            toast.error(error.response?.status === 403 ? "Access denied." : error.response?.data?.message || "Could not update user.");
        } finally {
            setIsSaving(false);
        }
    }

    async function toggleUser(email, action, field, value) {
        try {
            await api.patch(`/users/${encodeURIComponent(email)}/${action}`, { [field]: value });
            setUsers((current) => current.map((user) => user.email === email ? { ...user, [field]: value } : user));
            toast.success("User access updated.");
        } catch (error) {
            toast.error(error.response?.status === 403 ? "Access denied." : error.response?.data?.message || "Could not update user access.");
        }
    }

    return (
        <div className="p-6 text-slate-100 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Administration</p><h1 className="mt-2 text-4xl font-black">User management</h1><p className="mt-2 text-slate-400">Review accounts and manage access.</p></div>
                <form onSubmit={(event) => { event.preventDefault(); loadUsers(); }} className="flex w-full max-w-md gap-2"><label htmlFor="user-search" className="sr-only">Search users</label><div className="relative flex-1"><FaMagnifyingGlass className="pointer-events-none absolute left-4 top-3.5 text-slate-500" /><input id="user-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400" /></div><button type="submit" className="rounded-xl bg-cyan-400 px-4 font-black text-slate-950">Search</button></form>
            </div>
            {errorMessage && <div role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{errorMessage}</div>}
            {isLoading ? <p className="mt-10 text-slate-400">Loading users...</p> : <div className="mt-8 overflow-x-auto rounded-2xl border border-cyan-900/70 bg-slate-900"><table className="min-w-full text-left text-sm"><thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-4">User</th><th className="px-4 py-4">Email</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Actions</th></tr></thead><tbody className="divide-y divide-cyan-900/50">{users.map((user) => <tr key={user.email}><td className="px-4 py-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-cyan-300">{user.image ? <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="h-full w-full object-cover" /> : <FaUser />}</div><span className="font-bold text-white">{`${user.firstName} ${user.lastName}`.trim() || "Unnamed user"}</span></div></td><td className="px-4 py-4 text-slate-300">{user.email}</td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><span className={`rounded-full px-2 py-1 text-xs font-bold ${user.isadmin ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>{user.isadmin ? "Admin" : "User"}</span><span className={`rounded-full px-2 py-1 text-xs font-bold ${user.isblocked ? "bg-red-400/20 text-red-200" : "bg-emerald-400/20 text-emerald-200"}`}>{user.isblocked ? "Blocked" : "Active"}</span><span className={`rounded-full px-2 py-1 text-xs font-bold ${user.isemailverified ? "bg-emerald-400/20 text-emerald-200" : "bg-amber-400/20 text-amber-200"}`}>{user.isemailverified ? "Verified" : "Unverified"}</span></div></td><td className="px-4 py-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setEditingUser({ ...user, password: "" }); setSelectedImage(null); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold hover:border-cyan-400"><FaPen /> Edit</button><button type="button" onClick={() => toggleUser(user.email, "block", "isblocked", !user.isblocked)} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold hover:border-red-400">{user.isblocked ? "Unblock" : "Block"}</button><button type="button" onClick={() => toggleUser(user.email, "verify", "isemailverified", !user.isemailverified)} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold hover:border-emerald-400">{user.isemailverified ? "Unverify" : "Verify"}</button><button type="button" onClick={() => toggleUser(user.email, "admin", "isadmin", !user.isadmin)} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold hover:border-cyan-400">{user.isadmin ? "Remove admin" : "Make admin"}</button></div></td></tr>)}</tbody></table>{!users.length && !errorMessage && <p className="p-8 text-center text-slate-400">No users found.</p>}</div>}
            {editingUser && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-sm sm:p-6">
                <form onSubmit={handleSave} className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#0b1628] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                    <div className="relative overflow-hidden border-b border-slate-700/70 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_48%)] px-6 pb-6 pt-7 sm:px-8">
                        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />
                        <div className="relative flex items-start justify-between gap-5">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Account details</p>
                                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Edit user</h2>
                                <p className="mt-2 flex items-center gap-2 break-all text-sm text-slate-400"><FaEnvelope className="shrink-0 text-cyan-300" />{editingUser.email}</p>
                            </div>
                            <button type="button" onClick={() => { setEditingUser(null); setSelectedImage(null); }} aria-label="Close edit user form" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-600 bg-slate-900/80 text-slate-300 transition hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950"><FaXmark /></button>
                        </div>
                    </div>

                    <div className="space-y-7 p-6 sm:p-8">
                        <section className="flex flex-col gap-5 rounded-2xl border border-slate-700/80 bg-slate-950/45 p-4 sm:flex-row sm:items-center">
                            <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-300/50 bg-slate-800 shadow-lg shadow-cyan-950/40 sm:mx-0">
                                {imagePreview ? <img src={imagePreview} alt="New profile preview" className="h-full w-full object-cover" /> : editingUser.image ? <img src={editingUser.image} alt={`${editingUser.firstName} ${editingUser.lastName}`} className="h-full w-full object-cover" /> : <FaUser className="m-auto h-full p-6 text-cyan-300" />}
                            </div>
                            <div className="min-w-0 flex-1 text-center sm:text-left"><p className="font-bold text-white">Profile photo</p><p className="mt-1 text-sm text-slate-400">Upload a clear square image for the best result.</p></div>
                            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-950"><FaCamera />Choose image<input type="file" accept="image/*" onChange={(event) => setSelectedImage(event.target.files?.[0] || null)} className="sr-only" /></label>
                        </section>

                        <section>
                            <div className="mb-4"><h3 className="font-bold text-white">Personal information</h3><p className="mt-1 text-sm text-slate-400">Keep the user’s profile details accurate.</p></div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="text-sm font-bold text-slate-200" htmlFor="admin-user-first-name">First name<input id="admin-user-first-name" value={editingUser.firstName} onChange={(event) => updateUser("firstName", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" /></label>
                                <label className="text-sm font-bold text-slate-200" htmlFor="admin-user-last-name">Last name<input id="admin-user-last-name" value={editingUser.lastName} onChange={(event) => updateUser("lastName", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" /></label>
                                <label className="text-sm font-bold text-slate-200 sm:col-span-2" htmlFor="admin-user-gender">Gender<select id="admin-user-gender" value={editingUser.gender} onChange={(event) => updateUser("gender", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
                            <div className="flex gap-3"><FaLock className="mt-0.5 shrink-0 text-amber-300" /><div className="min-w-0 flex-1"><label className="text-sm font-bold text-white" htmlFor="admin-user-password">Reset password</label><p className="mt-1 text-sm text-slate-400">Leave this empty to keep the existing password.</p><input id="admin-user-password" type="password" value={editingUser.password} onChange={(event) => updateUser("password", event.target.value)} placeholder="Enter a new password" className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" /></div></div>
                        </section>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-700/70 bg-slate-950/45 px-6 py-5 sm:flex-row sm:justify-end sm:px-8"><button type="button" onClick={() => { setEditingUser(null); setSelectedImage(null); }} className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-200 transition hover:border-slate-400 hover:bg-slate-800">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"><FaCheck />{isSaving ? "Saving changes..." : "Save changes"}</button></div>
                </form>
            </div>}
        </div>
    );
}
