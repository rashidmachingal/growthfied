import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/interface/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#333',
        'primary-hover': "#1f1e1e",
        'teritory' : "#f0f0f0",
        'black': '#333',
        'white' : "#ffffff",
      },
      borderRadius: {
        'theme': '3px',
      },
      borderWidth: {
        'theme' : '0px'
      },
      height: {
        'theme' : "2.4rem"
      }
    },
    screens: {
      'vxm' : "250px",
      'xs' : '320px',
      'sm' : '400px',
      'xm' : '600px',
      'mmd': '780px',
      'vmd' : '830px',
      'md': '900px',
      'lg': '1000px',
      'xl': '1200px',
      '2xl' : '1300px'
    },
  },
  plugins: [],
};
export default config;
