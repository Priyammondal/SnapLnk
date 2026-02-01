import supabase, { supabaseUrl } from "./supabase";

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
    { title, longUrl, customUrl, userId },
    qrBlob
) {
    // use custom URL if provided, otherwise generate
    const shortUrl =
        customUrl?.trim() ||
        Math.random().toString(36).substring(2, 6);

    // ✅ deterministic path (depends on final shortUrl)
    const qrPath = `${userId}/qr-${shortUrl}.png`;

    // 🚨 prevent accidental double upload
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

    const { data, error } = await supabase
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

    if (error) {
        // rollback QR if DB insert fails
        await supabase.storage.from("qrs").remove([qrPath]);
        throw error;
    }

    return data;
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
    },
    newQrBlob
) {
    const newShortUrl = customUrl?.trim() || oldShortUrl;
    const shortUrlChanged = newShortUrl !== oldShortUrl;

    let qrPath = oldQrPath;
    let qrPublicUrl = null;

    try {
        // 🔁 If short URL OR long URL changed → regenerate QR
        if (shortUrlChanged || newQrBlob) {
            // delete old QR
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

        const { data, error } = await supabase
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

        if (error) throw error;

        return data;
    } catch (err) {
        // 🚨 rollback if QR upload succeeded but DB failed
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
