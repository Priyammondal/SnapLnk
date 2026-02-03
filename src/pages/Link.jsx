import React, { useEffect } from 'react';
import DeviceStats from '@/components/DeviceStats';
import Location from '@/components/Location';
import { Button } from '@/components/ui/button';
import { UrlState } from '@/Context';
import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrl } from '@/db/apiUrls';
import useFetch from '@/hooks/useFetch';
import { Copy, Download, Link as LinkIcon, Pencil, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader, BeatLoader } from 'react-spinners';

const Link = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();
  const { loading, data: url, error, fn } = useFetch(getUrl, { id, user_id: user?.id });
  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id);
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
    fnStats();
  }, []);

  if (error) navigate("/dashboard");

  const shortLink = url ? url.custom_url || url.short_url : '';

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = url?.qr;
    anchor.download = url?.title || 'qr-code';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleEdit = () => {
    navigate(`/dashboard?edit=${url.id}`)
  }

  const handleDelete = () => fnDelete().then(() => navigate('/dashboard'));

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8 md:p-10">
      {(loading || loadingStats) && <BarLoader width="100%" color="#FF5555" className="mb-4" />}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Link Info & QR Section */}
        <div
          className={`flex flex-1 flex-col gap-6 ${stats && stats.length > 0 ? 'lg:flex-col' : 'lg:flex-row'
            } bg-zinc-900/70 p-6 rounded-2xl border border-white/10 shadow-md w-full`}
        >
          {/* Link Info */}
          <div className="flex flex-col gap-4 min-w-0">
            <h1 className="text-4xl font-extrabold text-white truncate">{url?.title || 'Untitled Link'}</h1>

            <div className="flex flex-col gap-2 mt-2">
              {/* Short Link */}
              <a
                href={`https://snaplnk.netlify.app/${shortLink}`}
                target="_blank"
                className="text-destructive text-xl sm:text-2xl font-semibold break-words max-w-full hover:underline"
              >
                https://snaplnk.netlify.app/{shortLink}
              </a>

              {/* Original URL */}
              <a
                href={url?.original_url}
                target="_blank"
                className="flex items-center gap-2 text-sm text-muted-foreground break-words max-w-full hover:underline"
              >
                <LinkIcon className="w-4 h-4 flex-shrink-0" />
                {url?.original_url.length > 60 ? url?.original_url.slice(0, 57) + '...' : url?.original_url}
              </a>

              <span className="text-xs text-muted-foreground">
                Created: {new Date(url?.created_at).toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2 flex-wrap">
              <Button className="cursor-pointer" variant="ghost" onClick={() => navigator.clipboard.writeText(`https://snaplnk.netlify.app/${shortLink}`)}>
                <Copy />
              </Button>
              <Button className="cursor-pointer" variant="ghost" onClick={handleDownload}>
                <Download />
              </Button>
              <Button className="cursor-pointer" variant="ghost" onClick={handleEdit}>
                <Pencil />
              </Button>
              <Button className="cursor-pointer" variant="ghost" onClick={handleDelete}>
                {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className={`flex flex-1 justify-center ${stats && stats.length > 0 ? 'lg:justify-center' : 'lg:justify-end'
            } items-start`}>
            <img
              src={url?.qr}
              alt="QR Code"
              className="w-48 sm:w-100 max-w-full object-contain rounded-lg ring ring-destructive/50"
            />
          </div>
        </div>

        {/* Stats Panel */}
        {stats && stats.length > 0 && (
          <div className="flex-1 flex flex-col gap-6">
            {/* Total Clicks */}
            <div className="bg-zinc-900/70 p-4 rounded-2xl border border-white/10 shadow-md">
              <h2 className="text-2xl font-bold text-white mb-2">Total Clicks</h2>
              <p className="text-3xl font-extrabold text-destructive">{stats.length}</p>
            </div>

            {/* Location Data */}
            {stats.some(stat => stat.city) && (
              <div className="bg-zinc-900/70 p-4 rounded-2xl border border-white/10 shadow-md">
                <h2 className="text-2xl font-bold text-white mb-2">Location Data</h2>
                <Location stats={stats} />
              </div>
            )}

            {/* Device Info */}
            {stats.some(stat => stat.device) && (
              <div className="bg-zinc-900/70 p-4 rounded-2xl border border-white/10 shadow-md">
                <h2 className="text-2xl font-bold text-white mb-2">Device Info</h2>
                <DeviceStats stats={stats} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Link;
