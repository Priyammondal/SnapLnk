import { deleteUserQrFolder } from "./apiUrls";
import supabase, { supabaseUrl } from "./supabase";

export async function deleteProfilePic(path) {
    if (!path) return;

    const { error } = await supabase.storage
        .from("profile_pic")
        .remove([path]);
    if (error) {
        console.error("Error deleting profile picture:", error.message);
        throw new Error(error.message);
    }
}

export async function updateProfilePic(file, user) {
    // 1️⃣ Delete old avatar if exists
    const oldPath = user.user_metadata?.profile_pic_path;
    if (oldPath) {
        await deleteProfilePic(oldPath);
    }
    // 2️⃣ Upload new avatar
    const fileExt = file.name.split(".").pop();
    const fileName = `user-${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("profile_pic")
        .upload(fileName, file, { upsert: true });
    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const profilePicUrl = `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`;

    // 3️⃣ Update user metadata
    const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
            profile_pic: profilePicUrl,
            profile_pic_path: fileName,
        },
    });

    if (updateError && data?.user) {
        throw new Error("Avatar Update Failed")
    }

    if (updateError && !data?.user) {
        if (fileName) {
            await supabase.storage
                .from("profile_pic")
                .remove([fileName]);
        }
        const userId = user?.id;
        if (userId) {
            await deleteUserQrFolder(userId);
        }
        const error = new Error("AUTH_USER_NOT_FOUND");
        error.code = "AUTH_USER_NOT_FOUND";
        throw error;
    }

    return data.user;
}

export const updateUserName = async (username, user) => {
    const {
        data,
        error: updateError,
    } = await supabase.auth.updateUser({
        data: { name: username }
    });

    if (updateError && data?.user) {
        throw new Error("Username Update Failed")
    }

    if (updateError && !data?.user) {
        const oldPath = user.user_metadata?.profile_pic_path;
        const userId = user?.id;
        if (userId) {
            await deleteUserQrFolder(userId);
        }
        if (oldPath) {
            await deleteProfilePic(oldPath);
        }
        const error = new Error("AUTH_USER_NOT_FOUND");
        error.code = "AUTH_USER_NOT_FOUND";
        throw error;
    }
    return data.user;
};

export const updatePassword = async (newPassword, user) => {
    const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError && data?.user) {
        throw new Error("Password Update Failed")
    }
    if (updateError && !data?.user) {
        const oldPath = user.user_metadata?.profile_pic_path;
        const userId = user?.id;
        if (userId) {
            await deleteUserQrFolder(userId);
        }
        if (oldPath) {
            await deleteProfilePic(oldPath);
        }
        const error = new Error("AUTH_USER_NOT_FOUND");
        error.code = "AUTH_USER_NOT_FOUND";
        throw error;
    }
    return data;
}