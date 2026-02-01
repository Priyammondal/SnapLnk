import { storeClicks } from '@/db/apiClicks';
import { getLongUrl } from '@/db/apiUrls';
import useFetch from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, fn: fnGetLongUrl } = useFetch(getLongUrl, id);
  const [clickCaptured, setClickCaptured] = useState(false);

  useEffect(() => {
    if (id) {
      fnGetLongUrl();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && data) {
      storeClicks(data.id)
        .then(() => {
          setTimeout(() => {
            // setClickCaptured(true);
          }, 2000)
        })
        .catch(() => { });
    }
  }, [loading, data]);

  useEffect(() => {
    if (clickCaptured) {
      window.location.replace(data.original_url);
    }
  }, [clickCaptured, data])

  if (loading && !clickCaptured) {
    return (
      <div className="relative min-h-screen overflow-hidden">
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

        {/* Foreground content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Spinner */}
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-400 border-t-transparent" />

            {/* Text */}
            <div>
              <p className="text-lg font-semibold text-red-200">
                Redirecting…
              </p>
              <p className="text-sm text-red-400">
                You are leaving this site
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (!data) {
    return <NotFound />;
  }

  return null;
};

export default RedirectLink;
