import supabase, { supabaseUrl } from "./supabase";
import Avatar from "../assets/avatar.webp"

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw new Error(error.message);
    }
    return data;

}

export async function signup({ name, email, password, profile_pic }) {
    let profilePicUrl;
    let profilePicPath;

    if (profile_pic) {
        const fileExt = profile_pic.name.split(".").pop();
        const fileName = `user-${crypto.randomUUID()}.${fileExt}`;

        const { error: storageError } = await supabase
            .storage
            .from("profile_pic")
            .upload(fileName, profile_pic, { upsert: true });

        if (storageError) throw new Error(storageError.message);

        profilePicPath = fileName;
        profilePicUrl = `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`;
    } else {
        profilePicUrl = Avatar;
        profilePicPath = null;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                profile_pic: profilePicUrl,
                profile_pic_path: profilePicPath,
            },
        },
    });

    if (error) throw new Error(error.message);
    return data;
}


export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
    const { data: session, error } = await supabase.auth.getSession(); //from local storage
    if (!session?.session) return null;
    if (error) throw new Error(error.message);
    return session.session.user;
}

export async function getCurrentUserFromDb() {
    const res = await supabase.auth.getUser(); //from db
    return res?.data?.user;
}