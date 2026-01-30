import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Copy, Download, Trash } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { deleteUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';

const LinkCard = ({ url, fetchUrls }) => {
    const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);
    const shortLink = `https://snaplnk.netlify.app/${url?.custom_url || url?.short_url}`;

    const handleDownload = () => {
        const anchor = document.createElement('a');
        anchor.href = url?.qr;
        anchor.target = "blank";
        anchor.download = url?.title || 'qr-code';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const handleDelete = () => {
        fnDelete().then(() => fetchUrls());
    };

    return (
        <Link to={`/link/${url?.id}`}>

            <div className="flex flex-col md:flex-row justify-between gap-4 p-5 rounded-2xl bg-zinc-900/70 backdrop-blur border border-white/5 p-6 hover:border-[#ff3b6b]/40 transition">
                {/* Link Info */}
                <div className="flex-1 flex flex-col justify-between z-10">
                    <div className="space-y-1 overflow-hidden">

                        <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                            {url?.title || 'Untitled Link'}
                        </h2>
                        <p
                            className="text-sm text-destructive font-semibold truncate sm:break-words"
                            title={shortLink}
                        >
                            {shortLink.length > 45 ? shortLink.slice(0, 42) + '...' : shortLink}
                        </p>
                        <p
                            className="text-xs text-muted-foreground truncate sm:break-words"
                            title={url?.original_url}
                        >
                            {url?.original_url.length > 60 ? url?.original_url.slice(0, 57) + '...' : url?.original_url}
                        </p>
                    </div>
                    <span className="mt-2 text-xs text-muted-foreground truncate z-10">
                        Created: {new Date(url?.created_at).toLocaleString()}
                    </span>
                </div>

                {/* QR Code + Actions */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0 z-10">
                    <img
                        src={url?.qr}
                        alt="QR Code"
                        className="h-60 w-60 md:h-32 md:w-32 object-contain rounded-xl ring ring-destructive/50 flex-shrink-0 self-center md:self-start"
                    />
                    <div className="flex gap-2 justify-center md:flex-col">
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                navigator.clipboard.writeText(shortLink)
                            }}
                            className="p-2"
                        >
                            <Copy />
                        </Button>
                        <Button variant="ghost" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDownload();
                        }} className="p-2">
                            <Download />
                        </Button>
                        <Button variant="ghost" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDelete();
                        }} className="p-2">
                            {loadingDelete ? <BeatLoader size={6} color="white" /> : <Trash />}
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default LinkCard;
