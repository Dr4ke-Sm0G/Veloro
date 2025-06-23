/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
