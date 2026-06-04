import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../services/supabase";

type AuthState = {
  session: Session | null;

  setSession: (session: Session | null) => void;

  getSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,

  setSession: (session) => set({ session }),

  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({ session });
  },
}));
