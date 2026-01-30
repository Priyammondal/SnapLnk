import React from "react";
import { FileText } from "lucide-react";

const sections = [
    {
        title: "Acceptance of Terms",
        content: `By using SnapLnk, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.`,
    },
    {
        title: "Use of the Service",
        content: `SnapLnk provides a URL shortening and tracking service. You agree to use it only for lawful purposes and not to abuse the platform or submit harmful content.`,
    },
    {
        title: "Account Responsibility",
        content: `If you create an account, you are responsible for maintaining the confidentiality of your login details and any activity under your account.`,
    },
    {
        title: "Content Ownership",
        content: `You retain ownership of the content you create using SnapLnk. By using the service, you grant SnapLnk a limited license to operate, display, and share the content within the service.`,
    },
    {
        title: "Prohibited Activities",
        content: `You may not:
- Use SnapLnk to distribute malicious or illegal content.
- Attempt to disrupt or hack the service.
- Violate any applicable laws or regulations.`,
    },
    {
        title: "Changes to Terms",
        content: `SnapLnk may update these Terms and Conditions periodically. Continued use of the service indicates your acceptance of the new terms.`,
    },
    {
        title: "Limitation of Liability",
        content: `SnapLnk is provided "as is" without warranties. We are not liable for any damages arising from use of the service.`,
    },
];

export default function Terms() {
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
                        <FileText className="w-7 h-7 text-destructive" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        These terms govern your use of SnapLnk. Please read them carefully.
                    </p>
                </div>

                {/* Terms container */}
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
