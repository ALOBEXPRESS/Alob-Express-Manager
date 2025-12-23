"use client";
import { useEffect } from "react";

export default function PluginInit() {
  useEffect(() => {
    const loadPlugins = async () => {
      if (typeof window !== "undefined") {
        try {
          // Load Bootstrap JS asynchronously to prevent main thread blocking
          await import("bootstrap/dist/js/bootstrap.bundle.min.js");
          
          // Load CSS resources asynchronously
          // Using Promise.all to load them concurrently
          await Promise.all([
            import("react-quill/dist/quill.snow.css"),
            import("jsvectormap/dist/jsvectormap.css"),
            import("react-toastify/dist/ReactToastify.css"),
            import("react-modal-video/css/modal-video.min.css")
          ]);
        } catch (error) {
          console.error("Failed to load plugins:", error);
        }
      }
    };

    loadPlugins();
  }, []);

  return <></>;
}