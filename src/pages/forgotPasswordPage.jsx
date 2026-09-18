import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import techNestLogo from "../assets/Tech Nest logo.jfif";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    async function handleRequestOtp(event) {
        event.preventDefault();

        if (!email.trim()) {
            toast.error("Enter your email address.");
            return;
        }

        setIsSendingOtp(true);
        try {
            const response = await api.post("/users/forgot-password", { email: email.trim() });
            toast.success(response.data?.message || "OTP sent. Check your email.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not send the OTP.");
        } finally {
            setIsSendingOtp(false);
        }
    }

    async function handleResetPassword(event) {
        event.preventDefault();

        if (!email.trim() || !otp.trim() || !newPassword) {
            toast.error("Enter your email, OTP, and new password.");
            return;
        }

        setIsResetting(true);
        try {
            const response = await api.post("/users/reset-password", {
                email: email.trim(),
                otp: otp.trim(),
                newPassword,
            });
            toast.success(response.data?.message || "Password reset successfully.");
            setOtp("");
            setNewPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not reset your password.");
        } finally {
            setIsResetting(false);
        }
    }

    return (
        <div className="auth-page flex items-center justify-center">
            <div className="auth-card flex w-full max-w-md flex-col items-center">
                <img src={techNestLogo} alt="TechNest logo" className="m-1 h-17.5 w-25 rounded-lg object-cover" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Account recovery</p>
                <h1 className="mt-2 text-3xl font-black text-white">Reset password</h1>
                <p className="mt-3 text-center text-sm text-slate-700">Request a one-time code, then choose a new password.</p>

                <form onSubmit={handleRequestOtp} className="mt-6 w-full">
                    <label htmlFor="reset-email" className="font-semibold text-black">Email</label>
                    <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2 h-14 w-full rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40" placeholder="example@gmail.com" />
                    <button type="submit" disabled={isSendingOtp} className="mt-4 h-12 w-full rounded-xl bg-blue-700 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
                        {isSendingOtp ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <form onSubmit={handleResetPassword} className="mt-6 w-full border-t border-slate-300 pt-6">
                    <label htmlFor="reset-otp" className="font-semibold text-black">OTP received by email</label>
                    <input id="reset-otp" type="text" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} required className="mt-2 h-14 w-full rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40" placeholder="Enter your OTP" />
                    <label htmlFor="new-password" className="mt-4 block font-semibold text-black">New password</label>
                    <input id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={6} className="mt-2 h-14 w-full rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40" placeholder="Enter a new password" />
                    <button type="submit" disabled={isResetting} className="mt-4 h-12 w-full rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                        {isResetting ? "Resetting..." : "Reset password"}
                    </button>
                </form>

                <Link to="/login" className="mt-6 text-sm font-semibold text-blue-600 hover:underline">Back to login</Link>
            </div>
        </div>
    );
}
