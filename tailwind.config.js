import tailwindScrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "border-yellow-400",
    "border-indigo-900",
    "border-red-500",
    "border-indigo-700",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-600",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-orange-600",
    "bg-pink-500",
    "bg-lightBlue-500",
    "bg-indigo-600",
    "bg-indigo-100",
    "bg-yellow-600",
    "bg-yellow-100",
    "bg-pink-600",
    "bg-pink-100",
    "bg-blue-600",
    "bg-blue-100",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        loading: {
          "10%": { transform: "translateX(10%)" },
          "40%": { transform: "translateX(250%)", width: "50%" },
          "100%": { transform: "translateX(250%)", width: "80%" },
        },
      },
      animation: {
        loading: "loading 2s ease-in-out infinite",
      },
      colors: {
        background: "#F5F5FC",
        primary: "#1E1B80",
        secondary: "#FFFFFF",
        text1Color: "#1F2937",
        text2Color: "#6B7280",
        text3Color: "#374151",
        text4Color: "#9CA3AF",
        accent: "#F9FAFB",
        stroke: "#E5E7EB",
      },
      boxShadow: {
        custom: "0 6px 7px -3px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [tailwindScrollbar],
};
