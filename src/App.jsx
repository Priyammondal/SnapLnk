import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./App.css"
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import RequireAuth from './components/RequireAuth'
import { UrlProvider } from './Context'

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const Link = lazy(() => import("./pages/Link"));
const RedirectLink = lazy(() => import("./pages/RedirectLink"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/features',
        element: <Features />
      },
      {
        path: '/pricing',
        element: <Pricing />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/privacy',
        element: <Privacy />
      },
      {
        path: '/terms',
        element: <Terms />
      },
      {
        path: '/profile',
        element: <RequireAuth><Profile /></RequireAuth>
      },
      {
        path: '/dashboard',
        element: <RequireAuth><Dashboard /></RequireAuth>
      },
      {
        path: '/link/:id',
        element: <RequireAuth><Link /></RequireAuth>
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/:id',
        element: <RedirectLink />
      },
      {
        path: '/auth',
        element: <Auth />
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

const App = () => {
  return (
    <UrlProvider>
      <Suspense fallback={<FullScreenLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </UrlProvider>
  )
}

export default App

const FullScreenLoader = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_top,_rgba(255,59,107,0.14),_transparent_70%)]
        blur-xl opacity-70"
      />
      <div
        className="absolute inset-0 -z-10 pointer-events-none
        bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
      />

      {/* Center loader */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-400 border-t-transparent" />
          <p className="text-sm text-red-400">Loading…</p>
        </div>
      </div>
    </div>
  );
};