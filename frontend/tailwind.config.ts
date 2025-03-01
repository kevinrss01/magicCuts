import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            warning: {
              DEFAULT: "#D97706", // Couleur légèrement plus foncée pour le thème clair
              foreground: "#ffffff",
            },
            primary: {
              DEFAULT: "#404040",
              foreground: "#ffffff",
            },
            //hover
          },
        },
        dark: {
          colors: {
            warning: {
              DEFAULT: "#B45309", // Couleur encore plus foncée pour le thème sombre
              foreground: "#ffffff",
            },
            primary: {
              foreground: "white",
              DEFAULT: "#404040",
            },
          },
        },
      },
    }),
  ],
};
