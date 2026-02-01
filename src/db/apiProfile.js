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
    if (!file || !user) throw new Error("File and user are required");
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
        console.error("Error uploading new profile picture:", uploadError.message);
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

    if (updateError) {
        console.error("Error updating user profile:", updateError.message);
        throw new Error(updateError.message);
    }

    return data.user;
}

export const updateUserName = async (username) => {
    const {
        data,
        error,
    } = await supabase.auth.updateUser({
        data: { name: username },
    });

    if (error) throw error;
    return data;
};

export const updatePassword = async (newPassword) => {
    const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) throw updateError;
    return data;
}