import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"SF Pro Rounded"',
          '"SF Pro"',
          'ui-rounded',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Nunito"',
          '"Varela Round"',
          '"Quicksand"',
          'sans-serif',
        ],
      },
      colors: {
        background: "#08081a",
        foreground: "#f0f0f5",
        "accent-pink": "#ff7bfd",
        "accent-purple": "#aa44ff",
        "accent-magenta": "#ee55cc",
        "accent-blue": "#0088ff",
        "accent-cyan": "#00aaff",
        "accent-deep-blue": "#0022ff",
      },
    },
  },
  plugins: [],
};

export default config;
