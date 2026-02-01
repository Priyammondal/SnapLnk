import React from 'react'
import "./App.css"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'
import { UrlProvider } from './Context'
import RequireAuth from './components/RequireAuth'
import AuthLayout from './layouts/AuthLayout'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'

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
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App