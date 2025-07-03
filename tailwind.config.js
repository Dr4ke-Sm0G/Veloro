/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ["./src/**/*.{ts,tsx}",
            "./node_modules/flowbite/**/*.js",
            "./node_modules/flowbite-react/**/*.js"],
  theme: { extend: {
    fontFamily: {
      walsheim: ['"GT Walsheim"', 'sans-serif'],
    },
  } },
  corePlugins: {
    preflight: true,
    mode: 'jit',
  },
  plugins: [  require('flowbite/plugin')],
};
export default {
  darkMode: false, // désactive complètement
  // ou "media" si tu veux forcer le dark uniquement par préférences système
}