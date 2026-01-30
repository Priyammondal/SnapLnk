import { Link } from "react-router-dom"
import Logo from "../assets/logo.png"

const Footer = () => {
    return (
        <footer className="relative border-t border-white/10 bg-zinc-950">
            {/* subtle glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src={Logo}
                                alt="SnapLnk Logo"
                                className="h-7 sm:h-8 w-auto object-contain"
                            />
                            <h3 className="text-xl font-bold tracking-tight">
                                Snap<span className="text-destructive">Lnk</span>
                            </h3>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            A fast, secure, and modern URL shortener to create, manage,
                            and track your links effortlessly.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Product
                        </h4>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Company
                        </h4>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Get Started
                        </h4>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Shorten your first link in seconds.
                        </p>
                        <Link
                            to="/auth"
                            className="inline-flex mt-5 items-center justify-center rounded-lg bg-destructive px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-muted-foreground">
                    <span>© {new Date().getFullYear()} SnapLnk. All rights reserved.</span>
                    <span>Built with ❤️ for the modern web</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
