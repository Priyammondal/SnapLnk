import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/assets/logo.png'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LinkIcon, LogOut, User } from 'lucide-react'
import { UrlState } from '@/Context'
import useFetch from '@/hooks/useFetch'
import { logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = UrlState();
    const { loading, fn: fnLogout } = useFetch(logout);

    return (
        <>
            {loading && (
                <div className="fixed top-0 left-0 w-full z-50">
                    <BarLoader width="100%" color="#FF5555" />
                </div>
            )}

            <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-white/10">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={Logo}
                            alt="SnapLnk Logo"
                            className="h-7 sm:h-8 w-auto object-contain"
                        />
                        <h3 className="text-xl font-bold tracking-tight">
                            Snap<span className="text-destructive">Lnk</span>
                        </h3>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <Button
                                size="sm"
                                className="px-4 cursor-pointer"
                                onClick={() => navigate('/auth')}
                            >
                                Login
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={user?.user_metadata?.profile_pic
                                                ? `${user?.user_metadata.profile_pic}`
                                                : "https://api.dicebear.com/7.x/identicon/svg"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>
                                            <span>{user?.user_metadata.name?.[0] ?? 'U'}</span>
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuLabel className="truncate">
                                        {user?.user_metadata.name}
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link to="/profile" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link to="/dashboard" className="flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4" />
                                            <span>My Links</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="text-red-400 focus:text-red-400 cursor-pointer"
                                        onClick={() => {
                                            fnLogout().then(() => {
                                                setUser(null);
                                            })
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header
