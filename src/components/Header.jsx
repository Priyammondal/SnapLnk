import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '@/assets/logo1.png'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LinkIcon, LogOut } from 'lucide-react'

const Header = () => {
    const navigate = useNavigate();
    const user = false;
    return (
        <nav className='py-4 flex justify-between items-center pe-8'>
            <Link to="/">
                <img src={Logo} className='h-16' alt="SnapLnk Logo" />
            </Link>

            <div>
                {
                    !user ?
                        <Button onClick={() => navigate('/auth')}>Login</Button>
                        : <DropdownMenu>
                            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden outline-none">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>PM</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Priyam Mondal</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><LinkIcon className='mr-2 h-4 w-4' /><span>My Links</span></DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400"><LogOut className='mr-2 h-4 w-4' /> <span>Logout</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                }
            </div>
        </nav>
    )
}

export default Header