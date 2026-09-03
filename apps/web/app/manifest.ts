import type { MetadataRoute } from "next"

// start_url is the dashboard: customers reach the feedback form by QR code in
// their own browser, so the only person installing this is the owner.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "lil' bites Admin",
    short_name: "lil' bites",
    description: "Feedback and analytics for lil' bites.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
