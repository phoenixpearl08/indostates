import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Indo States Health Medical Center",
    short_name: "IndoStates",
    description:
      "State-of-the-art healthcare to the people of India. Dual US & Indian Board-Certified Specialists in Coimbatore.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#082949",
    orientation: "portrait-primary",
    categories: ["medical", "health", "hospital"],
    icons: [
      {
        src: "https://indostates.com/wp-content/uploads/2025/04/fav-02-150x150.png",
        sizes: "150x150",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "https://indostates.com/wp-content/uploads/2025/04/fav-02-300x300.png",
        sizes: "300x300",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "https://indostates.com/wp-content/uploads/2025/04/fav-02-300x300.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
