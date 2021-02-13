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
    extend: {
      fontFamily: {
        'display': 'Pixel Operator'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
});