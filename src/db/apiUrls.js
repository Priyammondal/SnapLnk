import { deleteProfilePic } from "./apiProfile";
import supabase from "./supabase";

export async function deleteUserQrFolder(userId) {
    const { data: files, error } = await supabase.storage
        .from("qrs")
        .list(userId, { limit: 1000 });

    if (error) {
        console.error("Failed to list QR files", error);
        throw error;
    }

    if (!files || files.length === 0) return;

    const paths = files.map(file => `${userId}/${file.name}`);

    const { error: deleteError } = await supabase.storage
        .from("qrs")
        .remove(paths);

    if (deleteError) {
        console.error("Failed to delete QR folder", deleteError);
        throw deleteError;
    }
}


export async function getUrls(user_id) {
    const { data, error } = await supabase.from("urls").select("*").eq("user_id", user_id);

    if (error) {
        console.error(error.message);
        throw new Error("Unable to load URLs");
    }

    return data;
}

export async function getUrlById(urlId) {
    const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("id", urlId)
        .single();

    if (error) throw error;
    return data;
}

export async function createUrl(
    { title, longUrl, customUrl, userId, user },
    qrBlob
) {
    const shortUrl =
        customUrl?.trim() ||
        Math.random().toString(36).substring(2, 6);

    const qrPath = `${userId}/qr-${shortUrl}.png`;

    const { error: uploadError } = await supabase.storage
        .from("qrs")
        .upload(qrPath, qrBlob, {
            upsert: false,
            contentType: "image/png",
        });

    if (uploadError) {
        // custom URL collision or double submit
        if (uploadError.statusCode === 409) {
            throw new Error("QR already exists for this short URL");
        }
        throw uploadError;
    }

    const qrPublicUrl = supabase.storage
        .from("qrs")
        .getPublicUrl(qrPath).data.publicUrl;

    const { data: createUrlData, error: createUrlError } = await supabase
        .from("urls")
        .insert({
            title,
            original_url: longUrl,
            custom_url: customUrl || null,
            short_url: shortUrl,
            user_id: userId,
            qr: qrPublicUrl,
            qr_path: qrPath,
        })
        .select()
        .single();

    if (createUrlError && createUrlData) {
        // rollback QR if DB insert fails
        await supabase.storage.from("qrs").remove([qrPath]);
        throw new Error("New link creation Failed");
    }

    if (createUrlError && !createUrlData) {
        const oldPath = user.user_metadata?.profile_pic_path;
        if (oldPath) {
            await deleteProfilePic(oldPath);
        }
        if (userId) {
            await deleteUserQrFolder(userId);
        }
        const error = new Error("AUTH_USER_NOT_FOUND");
        error.code = "AUTH_USER_NOT_FOUND";
        throw error;
    }

    return createUrlData;
}

export async function updateUrl(
    options,
    {
        id,
        title,
        longUrl,
        customUrl,
        userId,
        oldQrPath,
        oldShortUrl,
        user
    },
    newQrBlob
) {
    const newShortUrl = customUrl?.trim() || oldShortUrl;
    const shortUrlChanged = newShortUrl !== oldShortUrl;

    let qrPath = oldQrPath;
    let qrPublicUrl = null;

    try {
        if (shortUrlChanged || newQrBlob) {
            if (oldQrPath) {
                await supabase.storage.from("qrs").remove([oldQrPath]);
            }

            qrPath = `${userId}/qr-${newShortUrl}.png`;

            const { error: uploadError } = await supabase.storage
                .from("qrs")
                .upload(qrPath, newQrBlob, {
                    upsert: false,
                    contentType: "image/png",
                });

            if (uploadError) throw uploadError;

            qrPublicUrl = supabase.storage
                .from("qrs")
                .getPublicUrl(qrPath).data.publicUrl;
        }

        const { data: updateUrlData, error: updateUrlError } = await supabase
            .from("urls")
            .update({
                title,
                original_url: longUrl,
                short_url: newShortUrl,
                custom_url: customUrl || null,
                qr: qrPublicUrl ?? undefined,
                qr_path: qrPath,
            })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

        if (updateUrlError && !updateUrlData) {
            const oldPath = user.user_metadata?.profile_pic_path;
            if (oldPath) {
                await deleteProfilePic(oldPath);
            }
            if (userId) {
                await deleteUserQrFolder(userId);
            }
            const error = new Error("AUTH_USER_NOT_FOUND");
            error.code = "AUTH_USER_NOT_FOUND";
            throw error;
        }
        return updateUrlData;

    } catch (err) {
        if (qrPath && qrPath !== oldQrPath) {
            await supabase.storage.from("qrs").remove([qrPath]);
        }
        throw err;
    }
}


export async function deleteUrl(id) {
    // 1️⃣ fetch exact storage path
    const { data, error } = await supabase
        .from("urls")
        .select("qr_path")
        .eq("id", id)
        .single();

    if (error) throw error;

    // 2️⃣ delete from storage
    if (data?.qr_path) {
        const { error: storageError } = await supabase.storage
            .from("qrs")
            .remove([data.qr_path]);

        if (storageError) throw storageError;
    }

    // 3️⃣ delete DB row
    const { error: deleteError } = await supabase
        .from("urls")
        .delete()
        .eq("id", id);

    if (deleteError) throw deleteError;
}


export async function getLongUrl(id) {
    const { data, error } = await supabase.from("urls").select('id, original_url').or(`short_url.eq.${id},custom_url.eq.${id}`).single();

    if (error) {
        console.error(error.message);
        throw new Error("Error fetching long URL");
    }

    return data;
}

export async function getUrl({ id, user_id }) {
    const { data, error } = await supabase.from("urls").select("*").eq("id", id).eq("user_id", user_id).single();

    if (error) {
        console.error(error.message);
        throw new Error("Error getting URL info");
    }

    return data;
}
