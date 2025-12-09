// frontend/postcss.config.cjs
module.exports = {
  plugins: [
    // adapter required by newer Tailwind/PostCSS setups
    require('@tailwindcss/postcss')(),
    // autoprefixer for vendor prefixes
    require('autoprefixer')()
  ]
};
