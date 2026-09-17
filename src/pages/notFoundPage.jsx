import { FaArrowLeft, FaHouse } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#06111f] px-6 text-center text-white">
            <section className="max-w-lg rounded-3xl border border-cyan-900/70 bg-slate-900/90 p-10 shadow-2xl shadow-cyan-950/30">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">Error 404</p>
                <h1 className="mt-4 text-6xl font-black text-white">Page not found</h1>
                <p className="mt-4 text-slate-400">The page you requested does not exist or may have moved.</p>
                <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-white">
                    <FaHouse /> Back to home
                </Link>
                <button type="button" onClick={() => navigate(-1)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-cyan-300">
                    <FaArrowLeft /> Go back
                </button>
            </section>
        </main>
    );
}
