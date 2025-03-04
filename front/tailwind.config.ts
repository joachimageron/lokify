import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#5187C9",
              100: "#DEF1FC",
              200: "#BDE0F9",
              300: "#99C7EE",
              400: "#7AACDE",
              500: "#5187C9",
              600: "#3B69AC",
              700: "#284E90",
              800: "#193674",
              900: "#0F2560",
            },
            success: {
              DEFAULT: "#2FCE61",
              100: "#D8FCD5",
              200: "#ACFAAE",
              300: "#81F08E",
              400: "#5FE17B",
              500: "#2FCE61",
              600: "#22B15D",
              700: "#179457",
              800: "#0E774E",
              900: "#096248",
            },
            warning: {
              DEFAULT: "#FFD20A",
              100: "#FFF9CE",
              200: "#FFF29C",
              300: "#FFE96C",
              400: "#FFE047",
              500: "#FFD20A",
              600: "#DBB007",
              700: "#B78F05",
              800: "#937103",
              900: "#7A5B01",
            },
            danger: {
              DEFAULT: "#FF4953",
              100: "#FFE5DA",
              200: "#FFC5B6",
              300: "#FF9F91",
              400: "#FF7B76",
              500: "#FF4953",
              600: "#DB354D",
              700: "#B72447",
              800: "#93173F",
              900: "#7A0E3A",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#5187C9",
              100: "#DEF1FC",
              200: "#BDE0F9",
              300: "#99C7EE",
              400: "#7AACDE",
              500: "#5187C9",
              600: "#3B69AC",
              700: "#284E90",
              800: "#193674",
              900: "#0F2560",
            },
            success: {
              DEFAULT: "#2FCE61",
              100: "#D8FCD5",
              200: "#ACFAAE",
              300: "#81F08E",
              400: "#5FE17B",
              500: "#2FCE61",
              600: "#22B15D",
              700: "#179457",
              800: "#0E774E",
              900: "#096248",
            },
            warning: {
              DEFAULT: "#FFD20A",
              100: "#FFF9CE",
              200: "#FFF29C",
              300: "#FFE96C",
              400: "#FFE047",
              500: "#FFD20A",
              600: "#DBB007",
              700: "#B78F05",
              800: "#937103",
              900: "#7A5B01",
            },
            danger: {
              DEFAULT: "#FF4953",
              100: "#FFE5DA",
              200: "#FFC5B6",
              300: "#FF9F91",
              400: "#FF7B76",
              500: "#FF4953",
              600: "#DB354D",
              700: "#B72447",
              800: "#93173F",
              900: "#7A0E3A",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;