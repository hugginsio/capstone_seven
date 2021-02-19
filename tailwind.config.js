module.exports = (isProd) => ({
  prefix: '',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: {
    enabled: isProd,
    content: ['**/*.html']
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
});