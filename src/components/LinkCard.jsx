import React from "react";
import { Link } from "react-router-dom";

const LinkCard = ({ url }) => {
    const shortLink = `https://snaplnk.netlify.app/${url?.custom_url || url?.short_url
        }`;

    return (
        <Link to={`/link/${url?.id}`} className="block">
            <div
                className="
                    grid grid-cols-1 md:grid-cols-[1fr_auto]
                    gap-4
                    rounded-xl
                    bg-zinc-900/70
                    border border-white/5
                    hover:border-[#ff3b6b]/40
                    transition
                    p-4
                    "
            >
                {/* LEFT: INFO */}
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-white truncate">
                        {url?.title || "Untitled Link"}
                    </h2>

                    {/* Short link → wraps */}
                    <p className="mt-1 text-sm text-[#ff3b6b] break-all leading-snug">
                        {shortLink}
                    </p>

                    {/* Original link → ellipsis */}
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                        {url?.original_url}
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                        Created · {new Date(url?.created_at).toLocaleString()}
                    </p>
                </div>

                {/* RIGHT: QR */}
                <div
                    className="
                        flex
                        justify-center items-center   /* mobile + tablet */
                        md:justify-end md:items-start  /* desktop */
                        pt-3 md:pt-0
                    ">
                    <img
                        src={url?.qr}
                        alt="QR"
                        className="
                        h-28 w-28          /* mobile */
                        sm:h-32 sm:w-32    /* tablet */
                        md:h-28 md:w-28    /* desktop */
                        rounded-lg
                        object-contain
                        bg-zinc-900/60
                        ring-2 ring-white/10
                    "
                    />
                </div>
            </div>
        </Link>
    );
};

export default LinkCard;
