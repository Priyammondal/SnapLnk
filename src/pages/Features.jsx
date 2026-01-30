import { Link2, BarChart3, QrCode, ShieldCheck, Zap, Smartphone } from "lucide-react";
import { UrlState } from "@/Context";
import { useNavigate } from "react-router-dom";

export default function Features() {
    const { user } = UrlState();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (user) {
            navigate("/");       // dashboard / landing page
        } else {
            navigate("/auth");   // login / signup
        }
    };

    return (
        <section className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none 
  bg-[radial-gradient(ellipse_at_top,_rgba(255,59,107,0.14),_transparent_70%)]
  blur-xl opacity-70"
            />
            <div className="absolute inset-0 -z-10 pointer-events-none 
  bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
            />


            {/* HERO */}
            <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Short links.{" "}
                    <span className="text-[#ff3b6b]">Big impact.</span>
                </h1>

                <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
                    Turn long URLs into clean, memorable links you can manage, share,
                    and track effortlessly.
                </p>

                <button
                    onClick={handleGetStarted}
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#ff3b6b] px-8 py-3 text-sm font-semibold text-white hover:bg-[#ff547d] transition cursor-pointer"
                >
                    Get Started
                </button>
            </div>

            {/* FEATURES */}
            <div className="relative max-w-6xl mx-auto px-4 pb-24">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={<Link2 />}
                        title="Clean Short Links"
                        desc="Instantly transform long URLs into short, shareable links with optional custom aliases."
                    />
                    <FeatureCard
                        icon={<BarChart3 />}
                        title="Powerful Analytics"
                        desc="Understand your audience with click stats, devices, and locations."
                    />
                    <FeatureCard
                        icon={<QrCode />}
                        title="Built-in QR Codes"
                        desc="Every link comes with a downloadable, high-quality QR code."
                    />
                    <FeatureCard
                        icon={<Smartphone />}
                        title="Fully Responsive"
                        desc="Optimized for desktop, tablet, and mobile — looks great everywhere."
                    />
                    <FeatureCard
                        icon={<ShieldCheck />}
                        title="Secure by Default"
                        desc="Modern security practices to keep your links and data safe."
                    />
                    <FeatureCard
                        icon={<Zap />}
                        title="Fast & Reliable"
                        desc="Lightning-fast redirects backed by stable infrastructure."
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="rounded-2xl bg-zinc-900/70 backdrop-blur border border-white/5 p-6 hover:border-[#ff3b6b]/40 transition">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ff3b6b]/10 text-[#ff3b6b]">
                {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
