export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--nx-canvas)',
        surface: 'var(--nx-surface)',
        line: 'var(--nx-border)',
        ink: 'var(--nx-ink)',
        muted: 'var(--nx-muted)',
        navy: {
          50: '#eef2fb',
          100: '#d6e0f4',
          400: '#3d5183',
          600: '#1b2c56',
          800: '#101c3c',
          900: '#0b1739',
        },
        brand: {
          50: '#e9f1ff',
          100: '#cfe1ff',
          400: '#4f8bff',
          500: '#1463ff',
          600: '#0b4fd4',
          700: '#0a3ea6',
        },
        cyanx: {
          100: '#d3f5fb',
          400: '#2ecbe4',
          500: '#08b9d6',
          600: '#0492ab',
        },
        emeraldx: {
          100: '#d3f4e6',
          400: '#2bc48c',
          500: '#12a875',
          600: '#0c855c',
        },
        attention: {
          100: '#fdeed6',
          500: '#e89b29',
          600: '#b9761a',
        },
        danger: {
          100: '#fbdedc',
          500: '#d94b42',
          600: '#ab362e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,23,57,0.04), 0 12px 28px -18px rgba(11,23,57,0.35)',
        lift: '0 18px 40px -22px rgba(11,23,57,0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
