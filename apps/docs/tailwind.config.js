const { docsUi, docsUiPlugins } = require('next-docs-ui/tailwind-plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.mdx',
    './mdx-components.tsx',
    './node_modules/next-docs-ui/dist/**/*.js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'repeat-gradient-to-r':
          'repeating-linear-gradient(to right, var(--tw-gradient-stops))'
      },
      keyframes: {
        updown: {
          'from, to': {
            transform: 'translateY(-20px)'
          },
          '50%': {
            transform: 'translateY(20px)'
          }
        },
        light: {
          'from, to': {
            opacity: 0.7
          },
          '50%': {
            opacity: 1
          }
        },
        stroke: {
          from: {
            'stroke-dasharray': 1000
          },
          to: {
            'stroke-dasharray': 1000,
            'stroke-dashoffset': 2000
          }
        }
      },
      animation: {
        stroke: 'stroke 5s linear infinite',
        light: 'light 2s ease-in-out infinite',
        updown: 'updown 3s ease-in-out infinite'
      }
    }
  },
  plugins: [...docsUiPlugins, docsUi]
}
