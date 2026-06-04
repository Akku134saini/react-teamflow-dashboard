import { supabase } from "../services/supabase";

import toast from "react-hot-toast";
import Input from "./ui/input";
import type { ChangeEvent } from "react";

type Props = {
  userId: string;
  onUpload: (url: string) => void;
};

export default function AvatarUpload({ userId, onUpload }: Props) {
  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileExt = file.name.split(".").pop();

    const fileName = `${userId}.${fileExt}`;

    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    onUpload(data.publicUrl);

    toast.success("Avatar uploaded");
  };

  return <Input type="file" accept="image/*" onChange={uploadAvatar} />;
}
