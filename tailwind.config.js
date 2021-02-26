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
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite'
      },
      fontFamily: {
        display: 'Pixel Operator'
      },
      keyframes: {
        wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' }
        }
      }
    }
  },
  variants: {
    extend: {
      animation: ['hover']
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
});