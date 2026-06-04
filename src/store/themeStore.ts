import { create } from "zustand";

type ThemeState = {
  darkMode: boolean;

  toggleTheme: () => void;
};

export const useThemeStore =
  create<ThemeState>((set) => ({
    darkMode:
      localStorage.getItem("theme") ===
      "dark",

    toggleTheme: () =>
      set((state) => {
        const newTheme =
          !state.darkMode;

        localStorage.setItem(
          "theme",
          newTheme ? "dark" : "light"
        );

        return {
          darkMode: newTheme,
        };
      }),
  }));