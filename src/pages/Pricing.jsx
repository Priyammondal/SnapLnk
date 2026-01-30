import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UrlState } from "@/Context";

const pricingPlans = [
    {
        name: "Starter",
        originalPrice: "$1 / month",
        features: [
            "Unlimited short links",
            "Basic analytics",
            "Custom aliases",
            "Community support",
        ],
    },
    {
        name: "Pro",
        originalPrice: "$9 / month",
        features: [
            "Everything in Starter",
            "Advanced analytics",
            "QR code generation",
            "Priority support",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        originalPrice: "Contact Us",
        features: [
            "Everything in Pro",
            "Team management",
            "Custom domain",
            "Dedicated support",
        ],
    },
];

export default function Pricing() {
    const navigate = useNavigate();
    const { user } = UrlState();

    const handleClick = () => {
        if (user) {
            navigate("/");
        } else {
            navigate("/auth");
        }
    };

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
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Pricing that’s <span className="text-destructive">simple</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        SnapLnk is currently free for everyone. No cards. No limits.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-8 md:grid-cols-3">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-8 border transition
                ${plan.popular
                                    ? "bg-zinc-900/80 border-destructive/40 scale-[1.03]"
                                    : "bg-zinc-900/60 border-white/5 hover:border-destructive/30"
                                }`}
                        >
                            {plan.popular && (
                                <span
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 
                  bg-destructive text-white text-xs font-semibold px-4 py-1 rounded-full"
                                >
                                    Most Popular
                                </span>
                            )}

                            <h2 className="text-2xl font-semibold mb-4">
                                {plan.name}
                            </h2>

                            {/* Price */}
                            <div className="mb-6">
                                <p className="text-sm text-zinc-400 line-through">
                                    {plan.originalPrice}
                                </p>
                                <p className="text-3xl font-bold text-destructive">
                                    Free
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 text-sm text-zinc-300"
                                    >
                                        <Check className="w-4 h-4 mt-1 text-destructive flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={handleClick}
                                className={`w-full py-3 rounded-xl font-semibold transition cursor-pointer
                  ${plan.popular
                                        ? "bg-destructive hover:bg-destructive/90"
                                        : "bg-zinc-800 hover:bg-zinc-700"
                                    }`}
                            >
                                <span className="line-through mr-2 opacity-60">
                                    Choose Plan
                                </span>
                                Get Free Access
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
