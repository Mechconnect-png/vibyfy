import { supabase } from "../lib/supabase";

// Create a safe filename
const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");
};

export const uploadSong = async ({
  title,
  artist,
  album,
  genre,
  mood,
  duration,
  coverFile,
  audioFile,
}) => {
  try {
    const timestamp = Date.now();

    const coverName = `${timestamp}-${sanitizeFileName(
      coverFile.name
    )}`;

    const audioName = `${timestamp}-${sanitizeFileName(
      audioFile.name
    )}`;

    // Upload cover
    const { error: coverError } = await supabase.storage
      .from("covers")
      .upload(coverName, coverFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (coverError) throw coverError;

    // Upload audio
    const { error: audioError } = await supabase.storage
      .from("songs")
      .upload(audioName, audioFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (audioError) {
      await supabase.storage
        .from("covers")
        .remove([coverName]);

      throw audioError;
    }

    // Public URLs
    const { data: coverData } = supabase.storage
      .from("covers")
      .getPublicUrl(coverName);

    const { data: audioData } = supabase.storage
      .from("songs")
      .getPublicUrl(audioName);

    console.log("Cover URL:", coverData.publicUrl);
    console.log("Audio URL:", audioData.publicUrl);

    // Save in database
    const { data, error } = await supabase
      .from("songs")
      .insert({
        title,
        artist,
        album,
        genre,
        mood,
        duration,
        cover: coverData.publicUrl,
        audio_url: audioData.publicUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};