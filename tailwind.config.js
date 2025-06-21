/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1E1E1E",
        surface: "#2A2A2A",
        stroke: "#3D3D3D",
        accent: "#6366F1",
        muted: "#9CA3AF",
        primaryText: "#E5E7EB",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
