import { useEffect } from "react";

// This component ensures the app is always in dark mode
// No toggle functionality - dark mode is locked
export function ThemeToggle() {
  useEffect(() => {
    // Force dark mode on mount
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  // Return null - no UI needed, dark mode is always on
  return null;
}
