import React from "react";
import { Rocket, BarChart2, Users } from "lucide-react";
import { UrlState } from "@/Context";
import { useNavigate } from "react-router-dom";

const features = [
    {
        step: "01",
        icon: Rocket,
        title: "Fast & Reliable",
        desc:
            "Generate short links instantly with infrastructure designed for speed, reliability, and scale.",
    },
    {
        step: "02",
        icon: BarChart2,
        title: "Analytics That Matter",
        desc:
            "Track clicks, locations, and performance insights that help you optimize every link.",
    },
    {
        step: "03",
        icon: Users,
        title: "Built for Teams",
        desc:
            "Collaborate effortlessly by managing links together across your organization.",
    },
];

export default function About() {
    const { user } = UrlState();
    const navigate = useNavigate();
    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background glow */}
            <div
                className="absolute inset-0 pointer-events-none 
                    bg-[radial-gradient(ellipse_at_top,_rgba(255,59,107,0.14),_transparent_70%)]
                    blur-xl opacity-70"
            />
            <div
                className="absolute inset-0 -z-10 pointer-events-none 
                    bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
            />

            <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-24">
                {/* Header */}
                <div className="max-w-3xl mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        About <span className="text-destructive">SnapLnk</span>
                    </h1>
                    <p className="mt-6 text-zinc-400 text-lg">
                        SnapLnk helps individuals and teams turn long, messy URLs into
                        clean, memorable links — with full control, tracking, and insights.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid gap-8 md:grid-cols-3 mb-24">
                    {features.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.step}
                                className="relative rounded-2xl bg-zinc-900/60 border border-white/5 p-6 transition hover:border-destructive/40"
                            >
                                <span className="text-sm font-semibold text-destructive/80">
                                    {item.step}
                                </span>

                                <Icon className="w-6 h-6 mt-4 text-destructive" />

                                <h3 className="mt-4 text-lg font-semibold">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Mission section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Our <span className="text-destructive">Mission</span>
                        </h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We believe links are more than shortcuts — they’re decision points.
                            Our mission is to give creators, marketers, and teams the tools
                            they need to understand and optimize every click.
                        </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-white/5">
                        <img
                            src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Analytics dashboard"
                            className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/60 via-transparent to-transparent" />
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">
                        Start shortening with confidence
                    </h2>
                    <p className="text-zinc-400 mb-8">
                        Create clean links, track performance, and grow smarter — all from
                        one sleek dashboard.
                    </p>

                    <button
                        className="bg-destructive hover:bg-destructive/90 transition px-8 py-3 rounded-xl font-semibold cursor-pointer"
                        onClick={() => {
                            if (user) {
                                navigate("/");
                            } else {
                                navigate("/auth");
                            }
                        }
                        }
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}
