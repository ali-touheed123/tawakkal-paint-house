import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tawakkal Paint House",
    short_name: "Tawakkal Paint",
    description: "Premium Paints, Industrial Coatings & Solutions in Karachi",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1F3D",
    theme_color: "#C9973A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
