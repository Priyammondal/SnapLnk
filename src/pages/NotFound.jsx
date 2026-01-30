import React from "react";
import { Link } from "react-router-dom";
import { Link2Off } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-screen overflow-hidden text-white flex items-center justify-center">
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

            <div className="relative text-center px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900/60 border border-white/5 mb-6">
                    <Link2Off className="w-8 h-8 text-destructive" />
                </div>

                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-3">
                    Link not found
                </h2>
                <p className="text-zinc-400 max-w-md mx-auto mb-8">
                    The page you’re looking for doesn’t exist or the link may have expired.
                </p>

                <Link
                    to="/"
                    className="inline-block bg-destructive hover:bg-destructive/90 transition px-6 py-3 rounded-xl font-semibold"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
