import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

export default function AppRoutes() {
  const [session, setSession] = useState<Session | null>(null);

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
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={session ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element=<Login /> />
      </Routes>
    </BrowserRouter>
  );
}
