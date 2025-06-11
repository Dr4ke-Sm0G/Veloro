/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{ts,tsx}",
            "./node_modules/flowbite/**/*.js",
            "./node_modules/flowbite-react/**/*.js"],
  theme: { extend: {} },
  corePlugins: {
    preflight: true, // Active les styles de base (équivalent de @tailwind base)
    mode: 'jit',
  },
  plugins: [  require('flowbite/plugin')],
};
