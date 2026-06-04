import { supabase } from "./supabase";

export const fetchProfile = async (userId: string) => {
  return await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single();
};

export const saveProfileAvatar = async (
  userId: string,
  email: string,
  avatarUrl: string,
) => {
  return await supabase.from("profiles").upsert({
    id: userId,
    email,
    avatar_url: avatarUrl,
  });
};
