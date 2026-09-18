import techNestLogo from "../assets/Tech Nest logo.jfif";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-glow" />
            <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
                <div className="footer-reveal text-center sm:text-left">
                    <img src={techNestLogo} alt="TechNest logo" className="mx-auto h-12 w-16 rounded-xl object-cover shadow-lg shadow-cyan-950/50 sm:mx-0" />
                    <h2 className="mt-4 text-2xl font-black text-white">TechNest</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Your software partner for dependable technology and better digital experiences.</p>
                </div>
                <div className="footer-reveal footer-reveal-delay-1 text-center sm:text-left">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Contact</p>
                    <address className="mt-4 space-y-3 wrap-break-word text-sm not-italic text-slate-300">
                        <p className="wrap-break-word">TechNest (Pvt) Ltd, Colombo, Sri Lanka</p>
                        <a href="tel:+94711762895" className="block transition hover:text-cyan-300">071 176 2895</a>
                        <a href="https://t.me/adiyaAK49" target="_blank" rel="noreferrer" className="block transition hover:text-cyan-300">Telegram: @adiyaAK49</a>
                    </address>
                </div>
                <div className="footer-reveal footer-reveal-delay-2 text-center sm:col-span-2 sm:text-left lg:col-span-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Developer</p>
                    <p className="mt-4 text-lg font-bold text-white">Adeesha</p>
                    <p className="mt-1 text-sm text-slate-400">Your Software Partner</p>
                </div>
            </div>
            <div className="relative border-t border-cyan-900/60 px-5 py-4 text-center text-xs font-semibold text-slate-500">
                © 2026 TechNest. Built with care by Adeesha.
            </div>
        </footer>
    );
}
