import { useEffect, useState } from "react";
import { User, Lock, LogOut, LayoutDashboard, Link as LinkIcon, Camera, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UrlState } from "@/Context";
import { updatePassword, updateProfilePic, updateUserName } from "@/db/apiProfile";
import { logout } from "@/db/apiAuth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { BeatLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
    const { user, setUser, fetchUser } = UrlState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [profilePicLoading, setProfilePicLoading] = useState(false);
    const [userName, setUserName] = useState(user?.user_metadata?.name || "");
    const [nameLoading, setNameLoading] = useState(false);
    const [nameError, setNameError] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const MAX_IMAGE_SIZE = 200 * 1024; // 200 KB

    const { fn: fnLogout } = useFetch(logout);

    useEffect(() => {
        if (user?.user_metadata?.name) {
            setUserName(user.user_metadata.name);
        }
    }, [user]);

    useEffect(() => {
        if (nameError) {
            setTimeout(() => {
                setNameError("")
            }, 3000)
        }
    }, [nameError])

    const handleUpdateAvatar = async () => {
        try {
            setProfilePicLoading(true);
            await updateProfilePic(selectedFile, user);
            setSelectedFile(null);
            fetchUser();
        } catch (err) {
            console.error("Save Avatar error", err);
            if (err.code === "AUTH_USER_NOT_FOUND") {
                setSelectedFile(null);
                setPreview(null);
                setUser(null);
                localStorage.clear();
            } else {
                setSelectedFile(null);
                setPreview(null);
            }
        } finally {
            setProfilePicLoading(false);
        }
    };


    const validateUsername = (name) => {
        if (!name.trim()) return "Username cannot be empty";

        if (name.length < 3 || name.length > 20)
            return "Username must be between 3 and 20 characters";

        const regex = /^(?!_)(?!.*_$)[a-zA-Z0-9_]{3,20}$/;
        if (!regex.test(name))
            return "Only letters, numbers, and underscores allowed";

        if (name === user?.user_metadata?.name)
            return "This is already your current username";

        return "";
    };


    const handleUpdateUserName = async () => {
        const error = validateUsername(userName);

        if (error) {
            setNameError(error);
            return;
        }

        try {
            setNameError("");
            setNameLoading(true);
            await updateUserName(userName, user);
            fetchUser();
        } catch (err) {
            if (err.code === "AUTH_USER_NOT_FOUND") {
                setUser(null);
                localStorage.clear();
            } else {
                setNameError("Faild to update username!")
                setTimeout(() => {
                    setNameError("");
                }, 3000)
            }
        } finally {
            setNameLoading(false)
        }
    };



    const validatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword)
            return "All password fields are required";

        if (newPassword !== confirmPassword)
            return "New password and confirm password do not match";

        if (currentPassword === newPassword)
            return "New password must be different from current password";

        if (newPassword.length < 8)
            return "Password must be at least 8 characters";

        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/;

        if (!strongPasswordRegex.test(newPassword))
            return "Password must include uppercase, lowercase, number & special character";

        return "";
    };


    const handleChangePassword = async () => {
        const error = validatePassword();
        if (error) {
            setPasswordError(error);
            return;
        }

        try {
            setPasswordLoading(true);
            setPasswordError("");
            await updatePassword(newPassword, user);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            if (err.code === "AUTH_USER_NOT_FOUND") {
                setUser(null);
                localStorage.clear();
            } else {
                setPasswordError("Faild to update password!");
                setTimeout(() => {
                    setPasswordError("");
                }, 3000)
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Sidebar */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 rounded-full border border-zinc-700">
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
                            <label className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full cursor-pointer">
                                <Camera size={14} />
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        if (file.size > MAX_IMAGE_SIZE) {
                                            alert("Image size must be less than 200 KB");
                                            e.target.value = null;
                                            return;
                                        }
                                        setSelectedFile(file);
                                        setPreview(URL.createObjectURL(file));
                                        setShowConfirm(true);
                                    }}
                                />
                            </label>
                            <Dialog open={showConfirm} onOpenChange={(open) => {
                                if (!open) {
                                    setPreview(null);
                                    setSelectedFile(null);
                                    setShowConfirm(false);
                                }
                                setShowConfirm(open);
                            }}>
                                <DialogContent className="bg-zinc-900 border border-zinc-800">
                                    <DialogHeader>
                                        <DialogTitle className="text-zinc-100">
                                            Update profile picture
                                        </DialogTitle>
                                        <img
                                            src={preview}
                                            className="h-24 w-24 rounded-full mx-auto border border-zinc-700"
                                        />
                                        <DialogDescription className="text-zinc-400">
                                            Are you sure you want to update your profile picture?
                                        </DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setPreview(null);
                                                setSelectedFile(null);
                                                setShowConfirm(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                            disabled={profilePicLoading}
                                            onClick={async () => {
                                                await handleUpdateAvatar();
                                                setPreview(null);
                                                setSelectedFile(null);
                                                setShowConfirm(false);
                                            }}
                                        >
                                            {profilePicLoading ? <BeatLoader size={10} color="white" /> : "Confirm"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </div>

                        <div className="w-full space-y-2 mt-4">
                            <SidebarLink icon={LayoutDashboard} label="Dashboard" link="/dashboard" />
                            <SidebarLink icon={LinkIcon} label="My Links" link="/dashboard" />
                            <SidebarLink icon={PlusCircle} label="Create Link" link="/dashboard?create=new" />
                            <SidebarLink icon={User} label="Profile" active />
                            <SidebarLink icon={LogOut} label="Logout" action={() => {
                                fnLogout().then(() => {
                                    setUser(null);
                                })
                            }} danger />
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">

                    {/* Profile Info */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User size={18} /> Profile Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-zinc-400">Email</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.user_metadata?.email || ""}
                                        className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 opacity-70 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-400">Username</label>
                                    <input
                                        value={userName}
                                        onChange={(e) => {
                                            setUserName(e.target.value);
                                            if (nameError) setNameError("");
                                        }}
                                        type="text"
                                        className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700"
                                    />
                                    {nameError && (
                                        <p className="text-xs text-red-400 mt-1">{nameError}</p>
                                    )}
                                </div>
                                <Button disabled={nameLoading} className="bg-red-500 hover:bg-red-600 text-white cursor-pointer" onClick={handleUpdateUserName}>
                                    {nameLoading ? <BeatLoader size={10} color="white" /> : "Update Username"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Lock size={18} /> Change Password
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Current password"
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700"
                                />

                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700"
                                />

                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700"
                                />

                                {passwordError && (
                                    <p className="text-xs text-red-400">{passwordError}</p>
                                )}

                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                                    onClick={handleChangePassword}
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? <BeatLoader size={10} color="white" /> : "Update Password"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ icon: Icon, label, link, active, danger, action }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => {
                if (link) {
                    navigate(link);
                }
                if (action) {
                    action();
                }
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm transition 
        ${active ? "bg-red-500/20 text-red-400" : "hover:bg-zinc-800"}
        ${danger ? "text-red-400 hover:bg-red-500/10" : ""} cursor-pointer`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}
