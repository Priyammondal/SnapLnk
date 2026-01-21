import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <>
            <main className='min-h-screen px-4'>
                <Header />
                <Outlet />
            </main>
            <footer className='text-center p-10 bg-gray-800 mt-10'>Made with 💖 by Priyam</footer>
        </>
    )
}

export default AppLayout