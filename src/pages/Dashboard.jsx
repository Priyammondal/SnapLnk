import React, { useEffect, useRef, useState } from 'react';
import CreateLink from '@/components/CreateLink';
import Error from '@/components/Error';
import LinkCard from '@/components/LinkCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UrlState } from '@/Context';
import { getClicksForUrls } from '@/db/apiClicks';
import { getUrls } from '@/db/apiUrls';
import useFetch from '@/hooks/useFetch';
import { Filter, Link as LinkIcon, MousePointerClick } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, urls, setUrls } = UrlState();
  const { loading, error, data, fn: fnUrls } = useFetch(getUrls, user.id);
  const { loading: loadingClicks, data: clicks, fn: fnClicks } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const createLinkref = useRef(null);

  const filterUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setUrls(data)
  }, [data])

  useEffect(() => {
    fnUrls();
    fnClicks();
  }, []);

  useEffect(() => {
    if (searchParams.get("create") === "new") {
      setSearchParams({});
      createLinkref.current?.open();
    }
  }, [searchParams]);

  useEffect(() => {
    if (urls && urls.length) {
      fnClicks();
    }
  }, [urls]);

  const isEmpty = !urls || urls.length === 0;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col gap-8 p-4 sm:p-6 md:p-10">
      {(loading || loadingClicks) && <BarLoader width="100%" color="#FF5555" />}

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none 
        bg-[radial-gradient(ellipse_at_top,_rgba(255,59,107,0.14),_transparent_70%)]
        blur-xl opacity-70"
      />
      <div className="absolute inset-0 -z-10 pointer-events-none 
        bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
      />

      {/* Stats Section */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${isEmpty ? 'opacity-50' : ''}`}>
        {/* Links Created */}
        <Card className="rounded-2xl bg-zinc-900/70 backdrop-blur border border-white/5 p-6 hover:border-[#ff3b6b]/40 transition">
          <CardHeader className="flex items-center gap-3 relative z-10">
            <LinkIcon className="w-5 h-5 text-destructive" />
            <CardTitle className="text-lg font-bold">Links Created</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-2xl font-extrabold text-destructive">{urls?.length || '--'}</p>
          </CardContent>
        </Card>

        {/* Total Clicks */}
        <Card className="rounded-2xl bg-zinc-900/70 backdrop-blur border border-white/5 p-6 hover:border-[#ff3b6b]/40 transition">
          <CardHeader className="flex items-center gap-3 relative z-10">
            <MousePointerClick className="w-5 h-5 text-destructive" />
            <CardTitle className="text-lg font-bold">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-2xl font-extrabold text-destructive">{clicks?.length || '--'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Header + Create Link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {isEmpty ? 'Welcome!' : 'My Links'}
        </h1>
        <CreateLink ref={createLinkref} />
      </div>

      {/* Search input */}
      {!isEmpty && (
        <div className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Filter links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 text-sm sm:text-base bg-zinc-800 border border-white/20 placeholder:text-muted-foreground text-white"
          />
          <Filter className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {error && <Error message={error.message} />}

      {/* Empty State */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-6 p-8 bg-zinc-900/60 rounded-2xl border border-white/10 text-center mt-10">
          <p className="text-white text-xl font-semibold">
            You haven’t created any links yet.
          </p>
          <p className="text-muted-foreground">
            Start by creating your first link and track clicks in real-time.
          </p>
          <CreateLink />
        </div>
      ) : (
        // Links Grid
        <div className="grid grid-cols-1 gap-6">
          {filterUrls.slice().reverse().map((url) => (
            <LinkCard key={url.id} url={url} fetchUrls={fnUrls} onEdit={() => { createLinkref.current?.open(); }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
