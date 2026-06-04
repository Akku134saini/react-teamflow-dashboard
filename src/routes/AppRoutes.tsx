import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import SignUp from "../pages/SignUp";
import { useThemeStore } from "../store/themeStore";

export default function AppRoutes() {
  const [session, setSession] = useState<Session | null>(null);

  const { darkMode } = useThemeStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((__event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="
        min-h-screen
        bg-gray-100
        dark:bg-black
        transition-colors
      "
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={session ? <Dashboard /> : <Navigate to="/login" />}
            />

            <Route path="/login" element={<Login />} />

            <Route
              path="/signUp"
              element={!session ? <SignUp /> : <Navigate to="/dashboard" />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
