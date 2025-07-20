/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ["./src/**/*.{ts,tsx}",
            "./node_modules/flowbite/**/*.js",
            "./node_modules/flowbite-react/**/*.js"],
  theme: { extend: {
    fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],    },
  } },
  corePlugins: {
    preflight: true,
    mode: 'jit',
  },
  plugins: [  require('flowbite/plugin')],
};
export default {
  darkMode: false, 
}