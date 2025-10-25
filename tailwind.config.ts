import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "bg-dark": "rgb(var(--background-start-rgb))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        pressArm: {
          '0%': { transform: 'rotate3d(0, 0, 0, 0)' },
          '100%': { transform: 'rotate3d(0, 1, 0, 40deg)' }
        },
        bubblesAnimation: {
          '0%': { transform: 'translate(0,0)', opacity: "0" },
          '100%': { transform: 'translate(-15px, -40px)', opacity: "1" }
        },
        borderHighlight: {
          '0%, 100%': { borderColor: '#333' },
          '50%': { borderColor: '#00ad00' }
        },
          pulse: {
            '0%, 100%': { r: '20', opacity: '0.2' },
            '50%': { r: '22', opacity: '0.4' }
          }
      },
      animation: {
        'pressArm': 'pressArm 1s 2 alternate',
        'borderHighlight': 'borderHighlight 2s infinite ease-in-out',
        'bubblesAnimation': 'bubblesAnimation 8s infinite linear',
        'pulse': 'pulse 2s infinite'
      }
    },
  },
  plugins: [],
};
export default config;
