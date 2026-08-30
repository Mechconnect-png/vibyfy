import { supabase } from "../lib/supabase";

export const uploadAvatar = async (file) => {

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const fileName = `${user.id}-${Date.now()}`;

    await supabase.storage

        .from("avatars")

        .upload(fileName, file);

    const {
        data,
    } = supabase.storage

        .from("avatars")

        .getPublicUrl(fileName);

    return data.publicUrl;

};