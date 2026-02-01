"use client";
import { useEffect } from "react";
import { supabase, getSafeUser } from "@/lib/supabase/client";

const themeColors = new Set(["blue", "magenta", "orange", "green", "red", "blueDark"]);
const defaultThemeColor = "blue";

const ThemeInit = () => {
  useEffect(() => {
    let isMounted = true;
    const applyTheme = async () => {
      const storedColor =
        typeof window !== "undefined" ? localStorage.getItem("theme-color") : null;
      const normalizedStoredColor = themeColors.has(storedColor)
        ? storedColor
        : defaultThemeColor;
      let nextColor = normalizedStoredColor || defaultThemeColor;
      const { user } = await getSafeUser();
      if (user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("theme_color")
            .eq("id", user.id)
            .maybeSingle();
          const normalizedDbColor = themeColors.has(data?.theme_color)
            ? data.theme_color
            : null;
          if (!error && normalizedDbColor) {
            nextColor = normalizedDbColor;
          } else if (!error && !normalizedDbColor) {
            await supabase
              .from("users")
              .update({ theme_color: nextColor })
              .eq("id", user.id);
          }
        } catch {}
      }
      if (!isMounted) return;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme-color", nextColor);
        document.documentElement.setAttribute("data-theme-color", nextColor);
        document.body?.setAttribute("data-theme-color", nextColor);
      }
    };
    applyTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  return null;
};

export default ThemeInit;
