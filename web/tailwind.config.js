/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f5f0eb',
          100: '#e8dfd5',
          200: '#d4c4b0',
          300: '#bda080',
          400: '#a07d55',
          500: '#7a5c3a',
          600: '#5c4228',
          700: '#3e2b18',
          800: '#22160c',
          900: '#0e0904',
        },
        paper: {
          50:  '#fdfaf6',
          100: '#faf4ec',
          200: '#f4e8d4',
          300: '#ecd8b8',
          400: '#e0c494',
          500: '#d4ae70',
        },
        accent: {
          red:    '#c0392b',
          orange: '#e67e22',
          teal:   '#16a085',
        },
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper.svg')",
        'noise': "url('/textures/noise.svg')",
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-in':   'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      borderRadius: {
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '10px',
      },
      boxShadow: {
        'paper': '0 2px 8px rgba(14,9,4,0.12), 0 1px 2px rgba(14,9,4,0.08)',
        'paper-lg': '0 8px 32px rgba(14,9,4,0.16), 0 2px 8px rgba(14,9,4,0.08)',
        'stamp': 'inset 0 1px 2px rgba(14,9,4,0.1)',
      },
    },
  },
  plugins: [],
};
