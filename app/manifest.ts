import { MetadataRoute } from "next";
import { SITE_CONFIG } from "./seo/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5f8",
    theme_color: "#374bf9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
