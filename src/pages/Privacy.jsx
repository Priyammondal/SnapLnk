import React from "react";
import { Shield } from "lucide-react";

const sections = [
    {
        title: "Introduction",
        content: `At SnapLnk, your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect the information you share with us. By using SnapLnk, you agree to the practices described here.`,
    },
    {
        title: "Information We Collect",
        content: `We may collect:
- URLs you shorten.
- Basic analytics like click counts, device types, and locations.
- Optional profile information if you sign up (name, email).`,
    },
    {
        title: "How We Use Information",
        content: `Your information is used to:
- Provide and maintain SnapLnk services.
- Analyze performance and improve features.
- Ensure security and prevent abuse.`,
    },
    {
        title: "Data Sharing & Security",
        content: `We do not sell your data. We may share information with trusted partners who assist us in providing services (e.g., analytics). We implement robust security measures to protect your data.`,
    },
    {
        title: "Your Choices",
        content: `You can choose not to provide optional information. You may also request deletion of your personal data. All requests will be honored as per our capabilities.`,
    },
    {
        title: "Updates to This Policy",
        content: `SnapLnk may update this Privacy Policy periodically. The latest version will always be available here, along with the effective date.`,
    },
];

export default function Privacy() {
    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background glow */}
            <div
                className="absolute inset-0 pointer-events-none 
        bg-[radial-gradient(ellipse_at_top,_rgba(255,59,107,0.12),_transparent_70%)]
        blur-xl opacity-70"
            />
            <div
                className="absolute inset-0 -z-10 pointer-events-none 
        bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
            />

            <div className="relative max-w-4xl mx-auto px-6 md:px-16 py-24">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900/60 border border-white/5 mb-6">
                        <Shield className="w-7 h-7 text-destructive" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Learn how SnapLnk collects, uses, and protects your data.
                    </p>
                </div>

                {/* Policy container */}
                <div className="rounded-2xl bg-zinc-900/60 border border-white/5 divide-y divide-white/5">
                    {sections.map((section, idx) => (
                        <section
                            key={idx}
                            className="px-8 py-10"
                        >
                            <h2 className="text-xl font-semibold mb-4">
                                {section.title}
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                {/* Footer note */}
                <p className="text-xs text-zinc-500 text-center mt-10">
                    Last updated: January 2026
                </p>
            </div>
        </div>
    );
}
